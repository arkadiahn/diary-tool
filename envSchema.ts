import { z } from "zod";

const envSchema = z.object({
    // AUTH_SECRET: z.string(),
    // AUTH_KEYCLOAK_ID: z.string(),
    // AUTH_KEYCLOAK_SECRET: z.string(),
    // AUTH_KEYCLOAK_ISSUER: z.string().url(),
    // AUTH_URL: z.string().url(),

    // DATABASE_URL: z.string(),

    // SITE_NAME: z.string(),
    // SITE_DESCRIPTION: z.string(),
});

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof envSchema> {}
    }
}

export default envSchema;
