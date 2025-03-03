import { z } from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_BACKEND_URL: z.string().url(),
    BACKEND_URL: z.string().url(),
    TOP_LEVEL_DOMAIN: z.string(),

    NEXT_PUBLIC_KEYCLOAK_ISSUER: z.string().url(),
    NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: z.string(),
    KEYCLOAK_SECRET: z.string(),
    COOKIE_DOMAIN: z.string(),
});

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> {}
    }
}

export default envSchema;
