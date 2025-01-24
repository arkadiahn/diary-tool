import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Session } from "./models";
import crypto from "crypto";
import { NextURL } from "next/dist/server/web/next-url";


//@todo remove rewrite headers

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
const getRealUrl = (request: NextRequest): NextURL => {
	const url = request.nextUrl.clone();
	[url.host = "", url.port = ""] = (request.headers.get("x-forwarded-host")
		?? request.headers.get("host") ?? "").split(":");
	return url;
}

const base64URLEncode = (data: Buffer): string => data.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

const validateJWTToken = async (token: string, issuer: string): Promise<boolean> => {
	const [header, payload, signature] = token.split('.');
	const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());

	// validate token expiration
	if (decodedPayload.exp && decodedPayload.exp * 1000 <= Date.now()) {
		return false;
	}

	// validate token issuer
	if (decodedPayload.iss !== issuer) {
		return false;
	}

	const jwksResponse = await fetch(`${issuer}/protocol/openid-connect/certs`, {
		next: { revalidate: 60 },
		cache: "force-cache"
	});
	const jwks = await jwksResponse.json();
	const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
	
	// find matching public key
	const key = jwks.keys.find((k: any) => k.kid === decodedHeader.kid);
	if (!key) {
		return false;
	}

	// validate signature
	const signingInput = `${header}.${payload}`;
	const signatureBytes = Buffer.from(signature, 'base64url');
	const publicKey = crypto.createPublicKey({
		key: {
			kty: key.kty,
			n: key.n,
			e: key.e
		},
		format: 'jwk'
	});
	return crypto.verify(
		'RSA-SHA256',
		Buffer.from(signingInput),
		publicKey,
		signatureBytes
	);
}

/* -------------------------------------------------------------------------- */
/*                                SSR Functions                               */
/* -------------------------------------------------------------------------- */
export async function auth(): Promise<Session | null> {
	const session = (await cookies()).get("session");
	if (!session) {
		return null;
	}

	try {
		const [header, payload, signature] = session.value.split('.');
		// @todo check if token is valid!!!! iss, etc.
		const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
		return {
			expires: decodedPayload.exp,
			user: {
				id: decodedPayload.sub,
				name: decodedPayload.name,
				preferred_username: decodedPayload.preferred_username,
				email: decodedPayload.email,
				picture: decodedPayload.picture,
				scopes: decodedPayload.scope.split(' ')
			}
		} as Session;
	} catch (error) {
		return null;
	}
}


/* -------------------------------------------------------------------------- */
/*                                 Middleware                                 */
/* -------------------------------------------------------------------------- */
export function authMiddleware(wrappedMiddleware: (request: NextRequest) => NextResponse) {
	return async (request: NextRequest) => {
		const searchParams = request.nextUrl.searchParams;
		const state = searchParams.get("session_state");
		const code = searchParams.get("code");
		const iss = searchParams.get("iss");
		if (!state && !code && !iss) {
			return await wrappedMiddleware(request);
		}

		const realUrl = await getRealUrl(request);
		const redirectUrl = realUrl.clone();
		redirectUrl.searchParams.delete("session_state");
		redirectUrl.searchParams.delete("code");
		redirectUrl.searchParams.delete("iss");

		try {
			if (code) {
				const authParams = new URLSearchParams({
					code: code ?? "",
					redirect_url: redirectUrl.href
				});
				const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/session?${authParams}`);

				if (!sessionResponse.ok) {
					throw new Error("Session invalid!");
				}
				const newResponse = NextResponse.redirect(redirectUrl);
				newResponse.headers.set("Set-Cookie", sessionResponse.headers.get("Set-Cookie") ?? "");
				//@todo delete cookies from backend
				return newResponse;
			}
			throw new Error("test");
		} catch (error) {
			const response = NextResponse.redirect(redirectUrl);
			response.cookies.delete(process.env.SESSION_COOKIE_NAME);
			response.cookies.delete("refresh");
			return response;
		}
	}
}


/* -------------------------------------------------------------------------- */
/*                                  APIRoute                                  */
/* -------------------------------------------------------------------------- */
export const authRoute = async (request: NextRequest, { params }: { params: Promise<{ authPath: string[] }> }) => {
	const path = (await params).authPath;

	const unauthorizedResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	
	if (path.length == 0) return unauthorizedResponse;

	// /* ---------------------------------- LOGIN --------------------------------- */
	// if (path[0] == "login") {
	// 	const redirectUrl = request.nextUrl.searchParams.get("redirect_url");
	// 	if (!redirectUrl) return unauthorizedResponse;

	// 	const urlParams = new URLSearchParams({
	// 		client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
	// 		redirect_uri: redirectUrl,
	// 		response_type: "code"
	// 	});
	// 	return NextResponse.redirect(
	// 		`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${urlParams}`
	// 	);
	// }

	// /* --------------------------------- LOGOUT --------------------------------- */
	// if (path[0] == "logout") {
	// 	const redirectUrl = request.nextUrl.searchParams.get("redirect_url");
	// 	if (!redirectUrl) return unauthorizedResponse;
	// 	const response = NextResponse.redirect(
	// 		`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?redirect_uri=${redirectUrl}`
	// 	);
	// 	response.cookies.delete(process.env.SESSION_COOKIE_NAME);
	// 	response.cookies.delete("refresh");
	// 	return response;
	// }

	/* --------------------------------- SESSION -------------------------------- */
	if (path[0] == "session") {
		let tokenResponse: Response;

		/* ---------------------------- New Session Auth ---------------------------- */
		const code = request.nextUrl.searchParams.get("code");
		const redirectUrl = request.nextUrl.searchParams.get("redirect_url");
		if (code && redirectUrl) {
			tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					code,
					grant_type: "authorization_code",
					client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
					redirect_uri: redirectUrl,
					client_secret: process.env.KEYCLOAK_SECRET
				})
			});
			if (!tokenResponse.ok) {
				unauthorizedResponse.cookies.delete("redirect_url");
				unauthorizedResponse.cookies.delete("refresh");
				unauthorizedResponse.cookies.delete(process.env.SESSION_COOKIE_NAME);
				return unauthorizedResponse;
			}

			const tokenData = await tokenResponse.json();
			const [header, payload, signature] = tokenData.access_token.split('.');
			const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
			const response = NextResponse.json(decodedPayload);

			response.cookies.delete("redirect_url");
			response.cookies.set(process.env.SESSION_COOKIE_NAME, tokenData.access_token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: tokenData.expires_in,
				domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
			});
			response.cookies.set("refresh", tokenData.refresh_token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 60 * 60 * 24 * 30,
				domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
			});
			return response;
		}

		/* -------------------------- Existing Session Auth ------------------------- */
		const refreshToken = request.cookies.get("refresh");
		const sessionToken = request.cookies.get(process.env.SESSION_COOKIE_NAME);
		if (sessionToken) {

			// if no refresh token, delete session token
			if (!refreshToken?.value) {
				unauthorizedResponse.cookies.delete(process.env.SESSION_COOKIE_NAME);
				return unauthorizedResponse;
			}

			// if session token is valid, return session data
			if (await validateJWTToken(sessionToken.value, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER)) {
				const [header, payload, signature] = sessionToken.value.split('.');
				const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());

				const response = NextResponse.json(decodedPayload);
				response.cookies.set("refresh", refreshToken.value, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 60 * 60 * 24 * 30,
					domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
					path: "/api/session",
				});
				return response;
			}

			// if session token is expired, use refresh token to get new session token
			if (await validateJWTToken(refreshToken.value, process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER)) {
				const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams({
						refresh_token: refreshToken.value,
						grant_type: "refresh_token",
						client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID
					})
				});

				if (!tokenResponse.ok) {
					unauthorizedResponse.cookies.delete("refresh");
					unauthorizedResponse.cookies.delete(process.env.SESSION_COOKIE_NAME);
					return unauthorizedResponse;
				}

				const tokenData = await tokenResponse.json();
				const [header, payload, signature] = tokenData.access_token.split('.');
				const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());

				const response = NextResponse.json(decodedPayload);
				response.cookies.set(process.env.SESSION_COOKIE_NAME, tokenData.access_token, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: tokenData.expires_in,
					domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
				});
				response.cookies.set("refresh", refreshToken.value, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "strict",
					maxAge: 60 * 60 * 24 * 30,
					domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
				});
				return response;
			}

			// if refresh token is invalid, delete session token
			unauthorizedResponse.cookies.delete(process.env.SESSION_COOKIE_NAME);
			unauthorizedResponse.cookies.delete("refresh");
			return unauthorizedResponse;
		}
	}

	return unauthorizedResponse;
}
