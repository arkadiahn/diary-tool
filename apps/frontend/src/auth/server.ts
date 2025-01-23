import { NextRequest, NextResponse } from "next/server";
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";
import { Session } from "./models";


/* -------------------------------------------------------------------------- */
/*                                SSR Functions                               */
/* -------------------------------------------------------------------------- */
// export function signIn() {
// 	const params = new URLSearchParams({
// 		client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
// 		redirect_uri: window.location.href, // @todo fix this thing!
// 		response_type: "code"
// 	});
// 	redirect(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${params}`);
// }

// export function signOut() {
// 	const params = new URLSearchParams({
// 		client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
// 		post_logout_redirect_uri: window.location.href, // @todo fix this thing!
// 	});
// 	redirect(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${params}`);
// }

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
		const response = await wrappedMiddleware(request);

		const searchParams = request.nextUrl.searchParams;
		const state = searchParams.get("session_state");
		const code = searchParams.get("code");
		const iss = searchParams.get("iss");
		if (!state || !code || !iss) {
			return response;
		}

		const host = request.headers.get("host");
		const realUrl = request.nextUrl.clone();
		if (host) {
			realUrl.host = host;
		}
		realUrl.searchParams.delete("session_state");
		realUrl.searchParams.delete("code");
		realUrl.searchParams.delete("iss");

		const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				code,
				grant_type: "authorization_code",
				client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "",
				redirect_uri: realUrl.href,
			})
		});
		const token = await tokenResponse.json();
		// @todo check if token is valid!!!! iss, etc.

		const newURL = request.nextUrl.clone();
		newURL.searchParams.delete("session_state");
		newURL.searchParams.delete("code");
		newURL.searchParams.delete("iss");

		const newResponse = NextResponse.redirect(newURL);
		newResponse.cookies.set("session", token.access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 5,
			domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
		});
		// @todo make cookie settings variable
		return newResponse;
	}
}
