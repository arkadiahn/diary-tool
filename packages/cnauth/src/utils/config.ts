import type { AuthConfig, GlobalState } from "@/types";

const defaultConfig: Omit<AuthConfig, "baseUrl"> = {
    loginEndpoint: "/login",
    signoutEndpoint: "/logout",
    sessionEndpoint: "/session",
};

export let globalConfig: GlobalState = {
    _lastSync: 0,
    _session: undefined,
    _getSession: () => Promise.resolve(undefined),
    baseUrl: "",
    ...defaultConfig,
};

export const configureAuth = ({
    baseUrl,
    ...config
}: Partial<Omit<AuthConfig, "baseUrl">> & {
    baseUrl: string;
}): GlobalState => {
    globalConfig = {
        ...globalConfig,
        ...config,
        baseUrl,
    };
    return globalConfig;
};
