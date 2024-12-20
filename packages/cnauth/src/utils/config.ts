import type { AuthConfig, GlobalState } from "@/types";

const defaultConfig: Omit<AuthConfig, "baseApiUrl"> = {
	baseUrl: "",
    loginEndpoint: "/login",
    signoutEndpoint: "/logout",
    sessionEndpoint: "/session",
};

export let globalConfig: GlobalState = {
    _lastSync: 0,
    _session: undefined,
    _getSession: () => Promise.resolve(undefined),
    baseApiUrl: "",
    ...defaultConfig,
};

export const configureAuth = ({
    baseApiUrl,
    ...config
}: Partial<Omit<AuthConfig, "baseApiUrl">> & {
    baseApiUrl: string;
}): GlobalState => {
    globalConfig = {
        ...globalConfig,
        ...config,
        baseApiUrl,
    };
    return globalConfig;
};
