"server-only";

import { PrismaAdapter } from "@auth/prisma-adapter";
export type { Session } from "next-auth";

import prisma from "@/lib/prisma";
import NextAuth from "next-auth";

import Keycloak from "next-auth/providers/keycloak";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // needs to be JWT for the adapter to work (https://github.com/nextauthjs/next-auth/issues/12731#issuecomment-2698961955)
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
