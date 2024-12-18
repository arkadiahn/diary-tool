import { globalConfig } from "@/utils/config";

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
export async function signInClient(provider: string, redirectUrl: string) {
    const signUrl = `${globalConfig.baseUrl}${globalConfig.loginEndpoint}/${provider}?${new URLSearchParams(
        {
            redirect: redirectUrl,
        },
    )}`;
    window.location.href = signUrl;
}

export async function signOutClient(redirectUrl: string) {
    const signUrl = `${globalConfig.baseUrl}${globalConfig.signoutEndpoint}?${new URLSearchParams(
        {
            redirect: redirectUrl,
        },
    )}`;
    window.location.href = signUrl;
}
