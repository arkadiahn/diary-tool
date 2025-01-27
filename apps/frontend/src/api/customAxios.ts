import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export const customAxios = async <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
	let sessionCookie: string | undefined;
	if (typeof window === 'undefined') {
		const cookies = require('next/headers').cookies;
		sessionCookie = (await cookies()).get("session")?.value;
	} else {
		sessionCookie = Cookies.get("session");
	}

	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1",
		headers: {
			...(sessionCookie ? { "Authorization": `Bearer ${sessionCookie}` } : {}),
			...config.headers
		}
	});

	return instance({
		...config,
		...options
	});
};

export default customAxios;
