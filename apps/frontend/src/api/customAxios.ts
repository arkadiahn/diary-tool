import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { auth } from '../auth';

export const customAxios = async <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
	const session = await auth();

	console.log(session);

	const instance = axios.create({
		baseURL: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1",
		withCredentials: true,
		headers: {
			Authorization: `Bearer ${session?.accessToken}`,
			...config.headers
		}
	});
	
	return instance({
		...config,
		...options
	});
};

export default customAxios;
