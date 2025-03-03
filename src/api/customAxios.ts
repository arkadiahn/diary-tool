import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import Cookies from "js-cookie";
import * as jose from "jose";


export const customAxios = async <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
    let sessionCookie: string | undefined;
	let baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (typeof window === "undefined") {
        const cookies = require("next/headers").cookies;
        sessionCookie = (await cookies()).get("session")?.value;
    } else {
        sessionCookie = Cookies.get("session");
		baseURL = process.env.BACKEND_URL;
    }

    const instance = axios.create({
        baseURL: `${baseURL}/api/v1`,
        headers: {
            ...(sessionCookie ? { Authorization: `Bearer ${sessionCookie}` } : {}),
            ...config.headers,
        },
    });

	// remove duplicate segments from url
	instance.interceptors.request.use((config) => {
		if (config.url) {
			const segments = config.url.split('/').filter(Boolean);
			const firstSegment = segments.at(0);
			if (firstSegment) {
				const lastIndex = segments.lastIndexOf(firstSegment);
				if (lastIndex > 0) {
					config.url = '/' + segments.slice(lastIndex).join('/');
				}
			}
		}
		return config;
	});

	// refresh session if expired
	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (error.response.status === 401) {
				const retryAttempt = error.config._retry as boolean | undefined;
				if (retryAttempt) {
					throw error;
				}

				try {
					const decodedToken = await jose.decodeJwt(sessionCookie ?? "");
					if (decodedToken) {
						const sessionResponse = await fetch("/api/session", {
							credentials: "include",
							cache: "no-store",
						});
						if (sessionResponse.status !== 200) {
							window.location.href = "/";
						} else {
							error.config._retry = true;
							return instance(error.config);
						}
					}
				} catch {
					window.location.href = "/";
				}
			}
			throw error;
		}
	);

    return instance({
        ...config,
        ...options,
    });
};

export default customAxios;
