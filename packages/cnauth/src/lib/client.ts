import { formatRedirectUrl } from "@/utils/helpers";
import { globalConfig } from "@/utils/config";


/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
export async function signInClient(provider: string, redirect: string) {
    const signUrl = `${globalConfig.baseApiUrl}${globalConfig.loginEndpoint}?${new URLSearchParams(
        {
            redirect: formatRedirectUrl(redirect),
            method: provider
        },
    )}`;
    window.location.href = signUrl;
}

export async function signOutClient(redirect: string) {
    const signUrl = `${globalConfig.baseApiUrl}${globalConfig.signoutEndpoint}?${new URLSearchParams(
        {
            redirect: formatRedirectUrl(redirect),
        },
    )}`;
    window.location.href = signUrl;
}
