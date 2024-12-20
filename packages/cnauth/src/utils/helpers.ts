import { globalConfig } from "./config";

export const formatRedirectUrl = (path: string): string => {
	// if (path.startsWith('http')) return path;
	return new URL(
		path.startsWith('/') ? path.slice(1) : path,
		globalConfig.baseUrl
	).toString();
};
