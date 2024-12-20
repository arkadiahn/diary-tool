import { redirect as redirectTo } from "next/navigation";
import { formatRedirectUrl } from "@/utils/helpers";
import { globalConfig } from "@/utils/config";


/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
// getSession

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
export function signInServer(provider: string, redirect: string) {
    const signUrl = `${globalConfig.baseApiUrl}${globalConfig.loginEndpoint}?${new URLSearchParams(
        {
            redirect: formatRedirectUrl(redirect),
			method: provider
        },
    )}`;
    redirectTo(signUrl);
}

export function signOutServer(redirect: string) {
    const signUrl = `${globalConfig.baseApiUrl}${globalConfig.signoutEndpoint}?${new URLSearchParams(
        {
            redirect: formatRedirectUrl(redirect),
        },
    )}`;
    redirectTo(signUrl);
}

export function auth() {
    // as middleware
    // return session
}
