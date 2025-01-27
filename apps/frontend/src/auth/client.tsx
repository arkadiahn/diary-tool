"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { createStore, StoreApi, useStore } from 'zustand';
import { Session } from './models';


/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */
export const signIn = () => {
	window.location.href = "/api/login?redirect_url=" + window.location.href;
}

export const signOut = () => {
	window.location.href = "/api/logout?redirect_url=" + window.location.href;
}


/* -------------------------------------------------------------------------- */
/*                               SessionProvider                              */
/* -------------------------------------------------------------------------- */
type SessionStore = {
	session: Session | null;
};

const SessionStoreContext = createContext<StoreApi<SessionStore> | null>(null);

export const SessionProvider = ({ children, initialSession = null }: { children: React.ReactNode, initialSession: Session | null }) => {
	const channel = new BroadcastChannel("session-channel");
	const [store] = useState(() =>
		createStore<SessionStore>(() => ({
			session: initialSession
		}))
	);

	const loggedIn = (session: Session | null) => session !== null;


	// @todo search way to implement this
	// (1. is initalSession is null check if user is logged in in keycloak)
	// - if yes, set session / login


	/* ----------------------------- Periodic Check ----------------------------- */
	useEffect(() => {
		if (store.getState().session) {
			const interval = setInterval(async () => {
				const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/session`, {
					credentials: "include",
					cache: "no-store"
				})
				if (sessionResponse.status === 401) {
					signOut();
				}
			}, 15000);
			return () => clearInterval(interval);
		}
	}, [store]);


	/* ----------------------------- Session Channel ---------------------------- */
	useEffect(() => {
		channel.postMessage(store.getState().session);
		
		channel.onmessage = (event) => {
			if (loggedIn(event.data) !== loggedIn(store.getState().session)) {
				window.location.reload();
			}
		};
		
		const unsubscribe = store.subscribe((state) => channel.postMessage(state.session));

		return () => {
			unsubscribe();
			channel.close();
		}
	}, []);


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
