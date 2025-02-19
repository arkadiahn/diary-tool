import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import Cookies from "js-cookie";
import * as jose from "jose";


export const customAxios = async <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
    let sessionCookie: string | undefined;
    if (typeof window === "undefined") {
        const cookies = require("next/headers").cookies;
        sessionCookie = (await cookies()).get("session")?.value;
    } else {
        sessionCookie = Cookies.get("session");
    }

    const instance = axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
        headers: {
            ...(sessionCookie ? { Authorization: `Bearer ${sessionCookie}` } : {}),
            ...config.headers,
        },
    });

	// @todo does this work (also for admins)
	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (error.response.status === 401) {
				console.log(sessionCookie);
				const decodedToken = await jose.decodeJwt(sessionCookie ?? "");
				if (decodedToken && decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
					const sessionResponse = await fetch("/api/session", {
						credentials: "include",
						cache: "no-store",
					});
					if (sessionResponse.status !== 200) {
						window.location.href = "/";
					}
				}
			}
		}
	);
	// @todo parse name id from url correctly

    return instance({
        ...config,
        ...options,
    });
};

export default customAxios;
