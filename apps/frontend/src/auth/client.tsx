"use client";

import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { createStore, StoreApi, useStore} from 'zustand';
import { Session } from './models';


/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
export const signIn = () => {
	const theme = localStorage.getItem("theme");
	const urlParams = new URLSearchParams({
		redirect_uri: window.location.href,
		...(theme && ["dark", "light"].includes(theme) ? { 
			dark: theme === "dark" ? "true" : "false"
		} : {})
	});
	window.location.href = "/api/login?" + urlParams;
}

export const signOut = () => {
	window.location.href = "/api/logout?redirect_uri=" + window.location.href;
}


/* -------------------------------------------------------------------------- */
/*                               SessionProvider                              */
/* -------------------------------------------------------------------------- */
type SessionStore = {
	session: Session | null;
};

const SessionStoreContext = createContext<StoreApi<SessionStore> | null>(null);

export const SessionProvider = ({ children, initialSession = null }: { children: React.ReactNode, initialSession: Session | null }) => {
	const [store] = useState(() =>
		createStore<SessionStore>(() => ({
			session: initialSession
		}))
	);

	const checkSession = useCallback(async () => {
		const sessionResponse = await fetch("/api/session", {
			credentials: "include",
			cache: "no-store"
		})
		if (sessionResponse.status === 401) {
			return false;
		} else if (sessionResponse.ok && store.getState().session === null) {
			return true;
		}
		return null;
	}, [store]);


	/* ------------------------------ Silent Login ------------------------------ */
	useEffect(() => {
		if (!store.getState().session) {
			const iframe = document.createElement('iframe');
			const params = new URLSearchParams({
				client_id: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
				redirect_uri: window.location.origin + "/api/silent",
				response_type: "code",
				prompt: "none",
				scope: "openid"
			});
			iframe.src = `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/auth?${params}`;
			iframe.className = 'hidden';
			iframe.onload = async() => {
				const iframeUrl = new URL(iframe.contentWindow?.location.href ?? "");
				iframe.remove();
				if (iframeUrl.searchParams.get("code")) {
					await fetch(`/api/session?${new URLSearchParams({ 
						code: iframeUrl.searchParams.get("code") ?? "",
						redirect_url: window.location.origin + "/api/silent"
					})}`, {
						credentials: "include",
						cache: "no-store"
					});
					window.location.href = window.location.href;
				}
			};
			document.body.appendChild(iframe);

			return () => {
				iframe.remove();
			};
		}
	}, [store]);


	/* ----------------------------- Periodic Check ----------------------------- */
	useEffect(() => {
		if (store.getState().session) {
			const interval = setInterval(async () => {
				const check = await checkSession();
				if (check === false) {
					signOut();
				} else if (check === true) {
					window.location.reload();
				}
			}, 30000);
			return () => clearInterval(interval);
		}
	}, [checkSession, store]);


	/* ------------------- Update Session On Visibility Change ------------------ */
	const visibilityHandler = useCallback(async () => {
		if (await checkSession()) {
			window.location.reload();
		}
	}, [checkSession]);
	useEffect(() => {
		document.addEventListener("visibilitychange", visibilityHandler);
		window.addEventListener("focus", visibilityHandler);
		return () => {
			document.removeEventListener("visibilitychange", visibilityHandler);
			window.removeEventListener("focus", visibilityHandler);
		};
	}, [visibilityHandler]);


	return (
		<SessionStoreContext.Provider value={store}>
			{children}
		</SessionStoreContext.Provider>
	)
}


/* -------------------------------------------------------------------------- */
/*                               useSession Hook                              */
/* -------------------------------------------------------------------------- */
export const useSession = (): SessionStore => {
	const store = useContext(SessionStoreContext);
	if (!store) {
		throw new Error('useSession must be used within a SessionProvider');
	}
	return useStore(store);
}
