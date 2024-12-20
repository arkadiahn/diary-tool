export const VERSION = "0.0.1";

// Types
export * from "./types";

// Client
export { AuthProvider } from "./components/AuthProvider";
export { useSession } from "./hooks/useSession";
export { signInClient, signOutClient } from "./lib/client";

// Server
export { signInServer, signOutServer } from "./lib/server";

// Utils
export { configureAuth } from "./utils/config";

// // Components
// export { NCSessionProvider } from './components/AuthProvider';

// // Hooks
// export { useAuth } from './hooks/useSession'

// Endpoints
// /auth/login
//  - site: github, google, apple, magic link, etc.
//  - redirect: /my-app/dashboard
// /auth/logout
// /auth/me

// React Components
// - client

// - middleware
// - api-route
// - server-side component
