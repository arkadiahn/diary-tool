import { NextRequest, NextResponse } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Session } from "./models";
import * as jose from 'jose';


//@todo remove rewrite headers

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
const buildRealUrl = (request: NextRequest): NextURL => {
	const url = request.nextUrl.clone();
	[url.host = "", url.port = ""] = (request.headers.get("x-forwarded-host")
		?? request.headers.get("host") ?? "").split(":");
	return url;
}

const decodeJWTToken = async (token?: string, issuer?: string, skipValidation: boolean = false): Promise<jose.JWTPayload | null> => {
	if (!token || !issuer) return null;
	try {
		if (skipValidation) {
			const decodedToken = await jose.decodeJwt(token);
			if (decodedToken.iss !== issuer) throw new Error("Unauthorized");
			return decodedToken;
		}

		const jwks = await fetch(`${issuer}/protocol/openid-connect/certs`, {
			next: { revalidate: 240 },
			cache: "force-cache"
		}).then(res => res.json());
		const decodedToken = await jose.jwtVerify(token, jose.createLocalJWKSet(jwks), {
			algorithms: ["RS256"],
			clockTolerance: 5,
			issuer
		});

		const userinfo = await fetch(`${issuer}/protocol/openid-connect/userinfo`, {
			headers: {
				Authorization: `Bearer ${token}`
			},
			cache: "no-store"
		});
		if (!userinfo.ok) throw new Error("Unauthorized");

		return decodedToken.payload;
	} catch (error) {
		return null;
	}
}

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
		domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
		priority: "high"
	});
	response.cookies.set("refresh", tokenData?.refresh_token ?? "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: tokenData?.refresh_expires_in ?? 0,
		domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
		priority: "high"
	});
	return response;
}


/* -------------------------------------------------------------------------- */
/*                                SSR Functions                               */
/* -------------------------------------------------------------------------- */
// @todo maybe add scopes check for routes?
export async function auth(redirectUrl?: string): Promise<Session | null> {
	try {
		const decodedPayload = await decodeJWTToken((await cookies()).get("session")?.value, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER, true);
		if (!decodedPayload) throw new Error("Unauthorized");

		// @todo better way to "parse" session?
		const sessionData: Session = {
			expires: decodedPayload.exp!,
			user: {
				id: decodedPayload.sub!,
				name: decodedPayload.name! as string,
				preferred_username: decodedPayload.preferred_username! as string,
				email: decodedPayload.email! as string,
				picture: decodedPayload.picture! as string,
				scopes: (decodedPayload.scope! as string).split(' ')
			}
		};
		return sessionData;
	} catch {
		if (redirectUrl) redirect(redirectUrl);
		return null;
	}
}


/* -------------------------------------------------------------------------- */
/*                                 Middleware                                 */
/* -------------------------------------------------------------------------- */
export function authMiddleware(wrappedMiddleware: (request: NextRequest) => NextResponse) {
	return async (request: NextRequest) => {
		const { searchParams } = request.nextUrl;
		const code = searchParams.get("code");
	
		const requestCookies = request.cookies.getAll();
		if (!searchParams.has("session_state") && !code && !searchParams.has("iss")) {

			let sessionResponse: Response | null = null;
			if (requestCookies.some(cookie => cookie.name === "session" || cookie.name === "refresh")) {
				sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/session`, { 
					headers: {
						cookie: requestCookies.map(
							cookie => `${cookie.name}=${cookie.value}`
						).join("; ")
					},
					cache: "no-store" 
				});
			}

			const wrappedResponse = wrappedMiddleware(request);

			if (sessionResponse && sessionResponse.ok) {
				wrappedResponse.headers.set("Set-Cookie", sessionResponse.headers.get("Set-Cookie") ?? "");
			}
			return wrappedResponse;
		}

		const redirectUrl = buildRealUrl(request);
		["session_state", "code", "iss"].forEach(param => redirectUrl.searchParams.delete(param));
		const response = NextResponse.redirect(redirectUrl);

		try {
			if (code) {
				const sessionResponse = await fetch(
					`${process.env.NEXT_PUBLIC_AUTH_URL}/api/session?${new URLSearchParams({
						code,
						redirect_url: redirectUrl.href
					})}`,
					{ cache: "no-store" }
				);
			
				if (sessionResponse.ok) {
					response.headers.set("Set-Cookie", sessionResponse.headers.get("Set-Cookie") ?? "");
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
	if (path.length == 0) return unauthorizedResponse;

	/* ---------------------------------- LOGIN --------------------------------- */
	if (path[0] == "login") {
		const redirectUrl = request.nextUrl.searchParams.get("redirect_url");
		const referer = request.headers.get("Referer");
		if (!redirectUrl) return referer ? NextResponse.redirect(referer) : unauthorizedResponse;

		const urlParams = new URLSearchParams({
			client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
			redirect_uri: redirectUrl,
			response_type: "code",
			scope: "openid"
		});
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${urlParams}`
		);
	}

	/* --------------------------------- LOGOUT --------------------------------- */
	if (path[0] == "logout") {
		const redirectUrl = request.nextUrl.searchParams.get("redirect_url");
		const referer = request.headers.get("Referer");
		if (!redirectUrl) return referer ? NextResponse.redirect(referer) : unauthorizedResponse;

		await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				refresh_token: request.cookies.get("refresh")?.value ?? "",
				client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
				client_secret: process.env.KEYCLOAK_SECRET
			}),
			cache: "no-store"
		});
		return setResponseCookies(NextResponse.redirect(redirectUrl));
	}

	/* --------------------------------- SESSION -------------------------------- */
	if (path[0] == "session") {

		/* ---------------------------- New Session Auth ---------------------------- */
		const redirectUrl = request.nextUrl.searchParams.get("redirect_url");
		const code = request.nextUrl.searchParams.get("code");
		if (code && redirectUrl) {
			const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					code,
					grant_type: "authorization_code",
					client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
					redirect_uri: redirectUrl,
					client_secret: process.env.KEYCLOAK_SECRET
				}),
				cache: "no-store"
			});
			if (!tokenResponse.ok) return setResponseCookies(unauthorizedResponse);
			
			const tokenData = await tokenResponse.json();
			return setResponseCookies(NextResponse.json(
				await decodeJWTToken(tokenData.access_token, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER)
			), tokenData);
		}

		/* -------------------------- Existing Session Auth ------------------------- */
		const sessionToken = request.cookies.get("session")?.value;
		const refreshToken = request.cookies.get("refresh")?.value;

		// if session token is valid, return session data
		const decodedSessionToken = await decodeJWTToken(sessionToken, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER);
		if (decodedSessionToken) return NextResponse.json(decodedSessionToken);

		// if no refresh token, delete session
		if (!refreshToken) return setResponseCookies(unauthorizedResponse);

		// if session token is expired, use refresh token to get new session token
		const decodedRefreshToken = await decodeJWTToken(refreshToken, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER, true);
		if (decodedRefreshToken) {
			const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: new URLSearchParams({
					refresh_token: refreshToken,
					grant_type: "refresh_token",
					client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
					client_secret: process.env.KEYCLOAK_SECRET
				}),
				cache: "no-store"
			});
			if (!tokenResponse.ok) return setResponseCookies(unauthorizedResponse);
			
			const tokenData = await tokenResponse.json();
			return setResponseCookies(NextResponse.json(
				await decodeJWTToken(tokenData.access_token, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER)
			), tokenData);
		}

		// if refresh token is invalid, delete session token
		return setResponseCookies(unauthorizedResponse);
	}

	return unauthorizedResponse;
}
