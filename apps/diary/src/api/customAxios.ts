import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const customAxios = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1",
		withCredentials: true
	});
	
	return instance({
		...config,
		...options
	});
};

export default customAxios;
