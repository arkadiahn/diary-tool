import axios, { AxiosRequestConfig } from 'axios';

export const customAxios = <T>(config: AxiosRequestConfig): Promise<T> => {
	const instance = axios.create({
		withCredentials: true
	});
	
	return instance(config).then(response => response.data);
};

export default customAxios;
