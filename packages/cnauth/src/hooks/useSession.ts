import { AuthContext, type AuthContextValue } from "@/components/AuthProvider";
import { globalConfig } from "@/utils/config";
import type { UseSessionOptions } from "@/types";
import React from "react";

/* -------------------------------------------------------------------------- */
/*                               useSession Hook                              */
/* -------------------------------------------------------------------------- */
export function useSession<R extends boolean>(
    options?: UseSessionOptions<R>,
): AuthContextValue<R> {
    // check if server component
    if (!AuthContext) {
        throw new Error("React Context is unavailable in Server Components");
    }

    // check if context is available on client
    // @ts-expect-error undefined if on client
    const sessionValue: AuthContextValue<R> = React.useContext(CNAuthContext);
    if (!sessionValue && process.env.NODE_ENV !== "production") {
        throw new Error(
            "`useSession()` must be wrapped in a <SessionProvider />",
        );
    }

    const { required, onRequiredUnauthenticated } = options ?? {};
    const requiredNotLoading =
        required && sessionValue.status === "unauthenticated";

    React.useEffect(() => {
        if (requiredNotLoading) {
            // @todo wrong redirect! should be the auth (popup) url
            const url = `${globalConfig.baseUrl}${globalConfig.loginEndpoint}?${new URLSearchParams(
                {
                    callbackUrl: window.location.href,
                },
            )}`;
            if (onRequiredUnauthenticated) {
                // do not redirect and exec callback if callback is provided
                onRequiredUnauthenticated();
            } else {
                // redirect of no callback is provided
                window.location.href = url;
            }
        }
    }, [requiredNotLoading, onRequiredUnauthenticated]);

    // return loading state (till redirected) if required and session is not authenticated
    if (requiredNotLoading) {
        return {
            data: sessionValue.data,
            status: "loading",
        };
    }

    // return session if not required or session is authenticated
    return sessionValue;
}
