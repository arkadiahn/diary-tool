"use client";

import { debounce } from "lodash";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { type StoreApi, createStore, useStore } from "zustand";
import type { Session } from "./models";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
export const signIn = () => {
    const theme = localStorage.getItem("theme");
    const urlParams = new URLSearchParams({
        redirect_uri: window.location.href,
        theme: theme ?? "system",
    });
    window.location.href = `/api/login?${urlParams}`;
};

export const signOut = () => {
    window.location.href = `/api/logout?redirect_uri=${window.location.href}`;
};

/* -------------------------------------------------------------------------- */
/*                               SessionProvider                              */
/* -------------------------------------------------------------------------- */
type SessionStore = {
    session: Session | null;
};

const SessionStoreContext = createContext<StoreApi<SessionStore> | null>(null);

export const SessionProvider = ({
    children,
    initialSession = null,
}: { children: React.ReactNode; initialSession: Session | null }) => {
    const [store] = useState(() =>
        createStore<SessionStore>(() => ({
            session: initialSession,
        })),
    );

    const checkSession = useCallback(async () => {
        const sessionResponse = await fetch("/api/session", {
            credentials: "include",
            cache: "no-store",
        });
        if (sessionResponse.status === 401) {
            return false;
        }
        if (sessionResponse.ok && store.getState().session === null) {
            return true;
        }
        return null;
    }, [store]);

    /* ------------------------------ Silent Login ------------------------------ */
    // @todo fix silent login
    // useEffect(() => {
    //     if (!store.getState().session) {
    //         const iframe = document.createElement("iframe");
    //         const params = new URLSearchParams({
    //             client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
    //             redirect_uri: `${window.location.origin}/api/silent`,
    //             response_type: "code",
    //             prompt: "none",
    //             scope: "openid",
    //         });
    //         // @todo iframe not hidden on safari
    //         const iframeEl = document.createElement("iframe");
    //         iframeEl.className = "hidden";
    //         iframeEl.src = `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${params}`;
    //         iframeEl.setAttribute("sandbox", "allow-same-origin allow-scripts");
    //         iframeEl.onload = async () => {
    //             const iframeUrl = new URL(iframeEl.contentWindow?.location.href ?? "");
    //             iframeEl.remove();
    //             if (iframeUrl.searchParams.get("code")) {
    //                 await fetch(
    //                     `/api/session?${new URLSearchParams({
    //                         code: iframeUrl.searchParams.get("code") ?? "",
    //                         redirect_url: `${window.location.origin}/api/silent`,
    //                     })}`,
    //                     {
    //                         credentials: "include",
    //                         cache: "no-store",
    //                     },
    //                 );
    //                 window.location.reload();
    //             }
    //         };
    //         document.body.appendChild(iframe);

    //         return () => {
    //             iframe.remove();
    //         };
    //     }
    // }, [store]);

    /* ------------------- Update Session On Visibility Change ------------------ */
    const debouncedHandler = useCallback(
        debounce(
            async () => {
                const sessionAvailable = await checkSession();
                if (sessionAvailable) {
                    window.location.reload();
                } else if (sessionAvailable === false && store.getState().session) {
                    signOut();
                }
            },
            80,
            { leading: true, trailing: false },
        ),
        [checkSession, store],
    );

    const visibilityHandler = useCallback(() => {
        if (document.visibilityState === "visible") {
            // debouncedHandler();
        }
    }, [debouncedHandler]);

    useEffect(() => {
        document.addEventListener("visibilitychange", visibilityHandler);
        window.addEventListener("focus", visibilityHandler);
        return () => {
            document.removeEventListener("visibilitychange", visibilityHandler);
            window.removeEventListener("focus", visibilityHandler);
            debouncedHandler.cancel();
        };
    }, [visibilityHandler, debouncedHandler]);

    return <SessionStoreContext.Provider value={store}>{children}</SessionStoreContext.Provider>;
};

/* -------------------------------------------------------------------------- */
/*                               useSession Hook                              */
/* -------------------------------------------------------------------------- */
export const useSession = (): SessionStore => {
    const store = useContext(SessionStoreContext);
    if (!store) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return useStore(store);
};
