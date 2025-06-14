import NextAuth from "next-auth";
export type { Session } from "next-auth";

import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Keycloak],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.scope = account?.scope?.split(" ") ?? [];
            }
            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    scope: token.scope,
                    sub: token.sub,
                },
            };
        },
    },
});

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            scope: string[];
            sub: string;
        };
    }
}
