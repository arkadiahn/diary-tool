import KeycloakProvider from "next-auth/providers/keycloak";
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
		scopes?: string[];
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken as string;
			return session;
		}
	},
	providers: [
		KeycloakProvider({
			wellKnown: `${process.env.KEYCLOAK_ISSUER}/.well-known/openid-configuration`,
			clientId: process.env.KEYCLOAK_CLIENT_ID,
			clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
			issuer: process.env.KEYCLOAK_ISSUER,
			authorization: process.env.KEYCLOAK_AUTHORIZATION
		}),
		// {
        //     id: "keycloak",
        //     name: "Keycloak",
        //     wellKnown: `${process.env.KEYCLOAK_ISSUER}/.well-known/openid-configuration`,
		// 	issuer: process.env.KEYCLOAK_ISSUER,
        //     type: 'oidc',
		// 	authorization: process.env.KEYCLOAK_AUTHORIZATION,
        //     checks: ["pkce", "state"],
        //     clientId: process.env.KEYCLOAK_CLIENT_ID,
        //     clientSecret: "",
        //     client: {
        //         token_endpoint_auth_method: "none"
        //     },
        //     profile(profile) {
		// 		console.log(profile);
        //         return {
        //             id: profile.sub,
        //             name: profile.name ?? profile.preferred_username,
        //             email: profile.email,
        //             image: profile.picture,
        //         }
        //     }
        // }
	],
});
