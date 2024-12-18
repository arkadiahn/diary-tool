import { globalConfig } from "@/utils/config";
import { redirect } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
// getSession

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
export function signInServer(provider: string, redirectUrl: string) {
    const signUrl = `${globalConfig.baseUrl}${globalConfig.loginEndpoint}/${provider}?${new URLSearchParams(
        {
            redirect: redirectUrl,
        },
    )}`;
    redirect(signUrl);
}

export function signOutServer(redirectUrl: string) {
    const signUrl = `${globalConfig.baseUrl}${globalConfig.signoutEndpoint}?${new URLSearchParams(
        {
            redirect: redirectUrl,
        },
    )}`;
    redirect(signUrl);
}

export function auth() {
    // as middleware
    // return session
}
