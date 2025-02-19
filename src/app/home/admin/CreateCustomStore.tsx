"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { type StateCreator, createStore, useStore as useZustandStore } from "zustand";

export default function createCustomStore<T>(initializer: StateCreator<T, [], [], T>) {
    const zustandStore = createStore<T>(initializer);
    type ZustandStoreApi = typeof zustandStore;

    const StoreContext = createContext<typeof zustandStore | undefined>(undefined);

    const StoreProvider = ({ children }: { children: ReactNode }) => {
        const storeRef = useRef<ZustandStoreApi>(null);
        if (!storeRef.current) {
            storeRef.current = zustandStore;
        }
        return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>;
    };

    const useStore = <TT,>(selector: (store: T) => TT): TT => {
        const storeContext = useContext(StoreContext);
        if (!storeContext) {
            throw new Error("[createCustomStore] useStore must be used within StoreProvider");
        }
        return useZustandStore(storeContext, selector);
    };

    return {
        StoreProvider,
        useStore,
    };
}
