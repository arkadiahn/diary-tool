import { formatRedirectUrl } from "@/utils/helpers";
import { globalConfig } from "@/utils/config";

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
export async function signIn(provider: string, redirect: string) {
    const signUrl = `${globalConfig.baseApiUrl}${globalConfig.loginEndpoint}?${new URLSearchParams(
        {
            redirect: formatRedirectUrl(redirect),
            provider
        },
    )}`;
    window.location.href = signUrl;
}

export async function signOut(redirect: string) {
    const signUrl = `${globalConfig.baseApiUrl}${globalConfig.signoutEndpoint}?${new URLSearchParams(
        {
            redirect: formatRedirectUrl(redirect),
        },
    )}`;
    window.location.href = signUrl;
}

