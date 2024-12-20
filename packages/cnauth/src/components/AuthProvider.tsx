import type { Session, SessionProviderProps } from "@/types";
import { globalConfig } from "@/utils/config";
import { broadcast } from "@/utils/broadcast";
import React from "react";


/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
export interface GetSessionHelperParams {
    broadcast?: boolean;
}
async function getSessionHelper(
    params?: GetSessionHelperParams,
): Promise<Session | null> {
    const res = await fetch(
        globalConfig.baseUrl + globalConfig.sessionEndpoint,
        {
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    if (!res.ok) throw res;

    if (params?.broadcast ?? true) {
        broadcast().postMessage({
            event: "session",
            data: { trigger: "getSession" },
        });
    }

    return res.json();
}

function useOnline() {
    const [isOnline, setIsOnline] = React.useState(true);

    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    React.useEffect(() => {
        window.addEventListener("online", setOnline);
        window.addEventListener("offline", setOffline);

        return () => {
            window.removeEventListener("online", setOnline);
            window.removeEventListener("offline", setOffline);
        };
    }, []);

    return isOnline;
}

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */
/**
 * Represents the auth context value type.
 * @template R - A boolean indicating if authentication is required (default: false)
 * If R is true, the route must be authenticated or loading
 * If R is false, the route can also be unauthenticated
 */
export type AuthContextValue<R extends boolean = false> = R extends true
    ?
          | { data: Session; status: "authenticated" }
          | { data: null; status: "loading" }
    :
          | { data: Session; status: "authenticated" }
          | { data: null; status: "unauthenticated" | "loading" };

export const AuthContext = React.createContext?.<AuthContextValue | undefined>(
    undefined,
);

/* -------------------------------------------------------------------------- */
/*                                  Provider                                  */
/* -------------------------------------------------------------------------- */
export function AuthProvider(props: SessionProviderProps) {
    // check if server component
    if (!AuthContext) {
        throw new Error("React Context is unavailable in Server Components");
    }

    const { children, refetchInterval, refetchOnWindowFocus } = props;

    const [session, setSession] = React.useState<Session | null | undefined>(
        undefined,
    );
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        globalConfig._getSession = async ({ event } = {}) => {
            try {
                const storageEvent = event === "storage";

                // if storage event or session is undefined, we need to get the session
                if (storageEvent || globalConfig._session === undefined) {
                    globalConfig._lastSync = Date.now();
                    globalConfig._session = await getSessionHelper({
                        broadcast: !storageEvent,
                    });
                    setSession(globalConfig._session);
                    return;
                }

                if (
                    !event ||
                    globalConfig._session === null ||
                    Date.now() < globalConfig._lastSync
                ) {
                    return;
                }

                globalConfig._lastSync = Date.now();
                globalConfig._session = await getSessionHelper({
                    broadcast: false,
                });
                setSession(globalConfig._session);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        globalConfig._getSession();

        return () => {
            globalConfig._lastSync = 0;
            globalConfig._session = undefined;
            globalConfig._getSession = () => Promise.resolve(undefined);
        };
    }, []);

    // listen for storage events
    React.useEffect(() => {
        const handle = () => globalConfig._getSession({ event: "storage" });

        broadcast().addEventListener("message", handle);
        return () => broadcast().removeEventListener("message", handle);
    }, []);

    React.useEffect(() => {
        const { refetchOnWindowFocus = true } = props;

        const visibilityHandler = () => {
            if (
                refetchOnWindowFocus &&
                document.visibilityState === "visible"
            ) {
                globalConfig._getSession({ event: "visibilitychange" });
            }
        };

        document.addEventListener("visibilitychange", visibilityHandler, false);
        return () =>
            document.removeEventListener(
                "visibilitychange",
                visibilityHandler,
                false,
            );
    }, [props.refetchOnWindowFocus]);

    const isOnline = useOnline();

    const shouldRefetch = isOnline;

    React.useEffect(() => {
        if (refetchInterval && shouldRefetch) {
            const refetchIntervalTimer = setInterval(() => {
                if (globalConfig._session) {
                    globalConfig._getSession({ event: "poll" });
                }
            }, refetchInterval * 1000);

            return () => clearInterval(refetchIntervalTimer);
        }
    }, [refetchInterval, shouldRefetch]);

    const value = React.useMemo(
        () => ({
            data: session,
            status: loading
                ? "loading"
                : session
                  ? "authenticated"
                  : "unauthenticated",
        }),
        [session, loading],
    );

    return (
        // @todo fix this typing bug
        // @ts-expect-error typing bug
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
