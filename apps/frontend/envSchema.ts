import { z } from "zod";

const envSchema = z.object({
	NEXT_PUBLIC_KEYCLOAK_ISSUER: z.string().url(),
	NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: z.string(),
	NEXT_PUBLIC_COOKIE_DOMAIN: z.string(),
	TOP_LEVEL_DOMAIN: z.string(),

	SESSION_COOKIE_NAME: z.string(),
	KEYCLOAK_SECRET: z.string(),

	NEXT_PUBLIC_FRONTEND_URL: z.string().url(),
	NEXT_PUBLIC_BACKEND_URL: z.string().url(),
	NEXT_PUBLIC_AUTH_URL: z.string().url()
});

declare global {
	namespace NodeJS {
	  interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}

export default envSchema;
