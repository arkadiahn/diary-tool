import { AuthConfig, GlobalState } from "@/types";


const defaultConfig: Omit<AuthConfig, "baseApiUrl"> = {
	baseUrl: "",
	apiUrl: "",
    loginEndpoint: "/login",
    signoutEndpoint: "/logout",
    sessionEndpoint: "/session",
};

declare global {
    var _cnauthConfig: GlobalState | undefined;
}

const globalConfig: GlobalState = (globalThis._cnauthConfig ??= {
    _lastSync: 0,
    _session: undefined,
    _getSession: () => Promise.resolve(undefined),
    baseApiUrl: "",
    ...defaultConfig,
});

const configureAuth = ({
    baseApiUrl,
    ...config
}: Partial<Omit<AuthConfig, "baseApiUrl">> & {
    baseApiUrl: string;
}): GlobalState => {
    Object.assign(globalConfig, {
        ...config,
        baseApiUrl,
    });
    return globalConfig;
};

export { globalConfig, configureAuth };
