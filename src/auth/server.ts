import * as jose from "jose";
import type { NextURL } from "next/dist/server/web/next-url";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import setCookie from "set-cookie-parser";
import type { Session } from "./models";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
const buildRealUrl = (request: NextRequest): NextURL => {
    const url = request.nextUrl.clone();
    [url.host = "", url.port = ""] = (
        request.headers.get("x-forwarded-host") ??
        request.headers.get("host") ??
        ""
    ).split(":");
    return url;
};

const decodeJWTToken = async (
    token?: string,
    issuer?: string,
    skipValidation = false,
): Promise<jose.JWTPayload | null> => {
    if (!token || !issuer) {
        return null;
    }
    try {
        if (skipValidation) {
            const decodedToken = await jose.decodeJwt(token);
            if (decodedToken.iss !== issuer) {
                throw new Error("Unauthorized");
            }
            return decodedToken;
        }

        const jwks = await fetch(`${issuer}/protocol/openid-connect/certs`, {
            next: { revalidate: 360 },
            cache: "force-cache",
        }).then((res) => res.json());
        const decodedToken = await jose.jwtVerify(token, jose.createLocalJWKSet(jwks), {
            algorithms: ["RS256"],
            clockTolerance: 5,
            issuer,
        });

        return decodedToken.payload;
    } catch {
        return null;
    }
};

interface TokenData {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
}
const setResponseCookies = (response: NextResponse, tokenData?: TokenData) => {
    response.cookies.set("session", tokenData?.access_token ?? "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: tokenData?.expires_in ?? 0,
        domain: process.env.COOKIE_DOMAIN,
        priority: "high",
    });
    response.cookies.set("refresh", tokenData?.refresh_token ?? "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: tokenData?.refresh_expires_in ?? 0,
        domain: process.env.COOKIE_DOMAIN,
        priority: "high",
    });
    return response;
};

const addMiddlewareCookies = (request: NextRequest, response: NextResponse, setCookies: string[]) => {
    if (setCookies.length > 0) {
        const allCookies = request.cookies.getAll();
        const cookies = setCookie.parse(setCookies, { decodeValues: true, map: true });
        allCookies.push(...Object.keys(cookies).map((key) => ({ name: key, value: cookies[key].value })));

        response.headers.set("Set-Cookie", setCookies.join(", "));
        response.headers.set("x-middleware-override-headers", "cookie");
        response.headers.set(
            "x-middleware-request-cookie",
            allCookies
                .filter((cookie) => cookie.name !== "refresh")
                .map((cookie) => `${cookie.name}=${cookie.value}`)
                .join("; "),
        );
    }
    request.cookies.delete("refresh");
    return response;
};

/* -------------------------------------------------------------------------- */
/*                                SSR Functions                               */
/* -------------------------------------------------------------------------- */
// @todo maybe add scopes check for routes?
export async function auth(redirectUrl?: string, requiredScopes?: string[]): Promise<{ session: Session | null }> {
    const requestHeaders = await headers();
    const requestCookies = await cookies();
    try {
        const decodedAccessPayload = await jose.decodeJwt(requestCookies.get("session")?.value ?? "");
        const decodedIdPayload = JSON.parse(Buffer.from(requestHeaders.get("x-id") ?? "", "base64").toString("utf-8"));
        if (!decodedIdPayload || !decodedAccessPayload) {
            throw new Error("Unauthorized");
        }

        // @todo better way to "parse/validate" session?
        const sessionData: Session = {
            expires: decodedAccessPayload.exp!,
            user: {
                id: decodedAccessPayload.sub!,
                name: decodedIdPayload.name! as string,
                preferred_username: decodedIdPayload.preferred_username! as string,
                email: decodedIdPayload.email! as string,
                picture: decodedIdPayload.picture! as string,
                scopes: (decodedAccessPayload.scope! as string).split(" "),
            },
        };

        if (requiredScopes) {
            if (!sessionData.user.scopes.some((scope) => requiredScopes.includes(scope))) {
                throw new Error("Unauthorized");
            }
        }

        return { session: sessionData };
    } catch (error) {
        console.error(error);
        if (redirectUrl) {
            redirect(redirectUrl);
        }
        return { session: null };
    }
}

/* -------------------------------------------------------------------------- */
/*                                 Middleware                                 */
/* -------------------------------------------------------------------------- */
// @todo rewrite middleware to not expose data to frontend and remove refresh token
export function authMiddleware(wrappedMiddleware: (request: NextRequest) => NextResponse) {
    return async (request: NextRequest) => {
        const { searchParams } = request.nextUrl;
        const code = searchParams.get("code");

        const requestCookies = request.cookies.getAll();
        if (!searchParams.has("session_state") && !code && !searchParams.has("iss")) {
            let sessionResponse: Response | null = null;
            if (requestCookies.some((cookie) => cookie.name === "session" || cookie.name === "refresh")) {
                sessionResponse = await fetch(`${buildRealUrl(request).origin}/api/session`, {
                    headers: {
                        cookie: requestCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; "),
                    },
                    cache: "no-store",
                });
            }

            const wrappedResponse = wrappedMiddleware(request);

            if (sessionResponse) {
                const sessionData = await sessionResponse.json();
                addMiddlewareCookies(request, wrappedResponse, sessionResponse.headers.getSetCookie());
                wrappedResponse.headers.set("x-id", sessionData.id);
            }
            return wrappedResponse;
        }

        const redirectUrl = buildRealUrl(request);
        for (const param of ["session_state", "code", "iss"]) {
            redirectUrl.searchParams.delete(param);
        }
        const response = NextResponse.redirect(redirectUrl);
        try {
            if (code) {
                const sessionResponse = await fetch(
                    `${buildRealUrl(request).origin}/api/session?${new URLSearchParams({
                        code,
                        redirect_url: redirectUrl.href,
                    })}`,
                    { cache: "no-store" },
                );

                if (sessionResponse.ok) {
                    const sessionData = await sessionResponse.json();
                    addMiddlewareCookies(request, response, sessionResponse.headers.getSetCookie());
                    response.headers.set("x-id", sessionData.id);
                    return response;
                }
            }
        } catch {}

        return setResponseCookies(response);
    };
}

/* -------------------------------------------------------------------------- */
/*                                  APIRoute                                  */
/* -------------------------------------------------------------------------- */
export const authRoute = async (request: NextRequest, { params }: { params: Promise<{ authPath: string[] }> }) => {
    const path = (await params).authPath;

    const unauthorizedResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (path.length === 0) {
        return unauthorizedResponse;
    }

    /* ---------------------------------- LOGIN --------------------------------- */
    if (path[0] === "login") {
        // @todo if keycloak error redirect to original page
        const redirectUri = request.nextUrl.searchParams.get("redirect_uri");
        const referer = request.headers.get("Referer");
        if (!redirectUri) {
            return referer ? NextResponse.redirect(referer) : unauthorizedResponse;
        }

        const urlParams = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
            response_type: "code",
            scope: "openid",
            ...Object.fromEntries(request.nextUrl.searchParams),
        });
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${urlParams}`,
        );
    }

    /* --------------------------------- LOGOUT --------------------------------- */
    if (path[0] === "logout") {
        // @todo sanitize redirect_uri
        const redirectUri = request.nextUrl.searchParams.get("redirect_uri");
        const referer = request.headers.get("Referer");
        if (!redirectUri) {
            return referer ? NextResponse.redirect(referer) : unauthorizedResponse;
        }

        await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                refresh_token: request.cookies.get("refresh")?.value ?? "",
                client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
                client_secret: process.env.KEYCLOAK_SECRET,
            }),
            cache: "no-store",
        });
        return setResponseCookies(NextResponse.redirect(redirectUri));
    }

    /* --------------------------------- SESSION -------------------------------- */
    if (path[0] === "session") {
        /* ---------------------------- New Session Auth ---------------------------- */
        const redirectUrl = request.nextUrl.searchParams.get("redirect_url");
        const code = request.nextUrl.searchParams.get("code");
        if (code && redirectUrl) {
            const tokenResponse = await fetch(
                `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        code,
                        grant_type: "authorization_code",
                        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
                        redirect_uri: redirectUrl,
                        client_secret: process.env.KEYCLOAK_SECRET,
                    }),
                    cache: "no-store",
                },
            );
            if (!tokenResponse.ok) {
                return setResponseCookies(unauthorizedResponse);
            }

            const tokenData = await tokenResponse.json();
            const decodedToken = await decodeJWTToken(tokenData.access_token, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER);
            const decodedIdToken = await decodeJWTToken(
                tokenData.id_token,
                process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
                false,
            );
            return setResponseCookies(
                NextResponse.json({
                    id: Buffer.from(JSON.stringify(decodedIdToken)).toString("base64"),
                    accessClaims: decodedToken,
                }),
                tokenData,
            );
        }

        /* -------------------------- Existing Session Auth ------------------------- */
        const sessionToken = request.cookies.get("session")?.value;
        const refreshToken = request.cookies.get("refresh")?.value;

        // if session token is valid, return session data
        const decodedSessionToken = await decodeJWTToken(sessionToken, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER, false);
        if (decodedSessionToken) {
            const userInfoResponse = await fetch(
                `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/userinfo`,
                {
                    headers: { Authorization: `Bearer ${sessionToken}` },
                    cache: "no-store",
                },
            );
            if (!userInfoResponse.ok) {
                return setResponseCookies(unauthorizedResponse);
            }
            return NextResponse.json({
                id: Buffer.from(await userInfoResponse.text()).toString("base64"),
                accessClaims: decodedSessionToken,
            });
        }

        // if no refresh token, delete session
        if (!refreshToken) {
            return setResponseCookies(unauthorizedResponse);
        }

        // if session token is expired, use refresh token to get new session token
        const decodedRefreshToken = await decodeJWTToken(refreshToken, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER, true);
        if (decodedRefreshToken) {
            const tokenResponse = await fetch(
                `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        refresh_token: refreshToken,
                        grant_type: "refresh_token",
                        client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
                        client_secret: process.env.KEYCLOAK_SECRET,
                    }),
                    cache: "no-store",
                },
            );
            if (!tokenResponse.ok) {
                return setResponseCookies(unauthorizedResponse);
            }

            const tokenData = await tokenResponse.json();
            const decodedIdToken = await decodeJWTToken(
                tokenData.id_token,
                process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
                false,
            );
            const decodedToken = await decodeJWTToken(
                tokenData.access_token,
                process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER,
                false,
            );
            return setResponseCookies(
                NextResponse.json({
                    id: Buffer.from(JSON.stringify(decodedIdToken)).toString("base64"),
                    accessClaims: decodedToken,
                }),
                tokenData,
            );
        }

        // if refresh token is invalid, delete session token
        return setResponseCookies(unauthorizedResponse);
    }

    if (path[0] === "silent") {
        return NextResponse.json(
            {
                idk: "What are you even looking for here xD",
            },
            { status: 200 },
        );
    }

    return unauthorizedResponse;
};
