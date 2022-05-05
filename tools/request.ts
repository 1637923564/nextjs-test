import axios, { AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
	baseURL: '/',
})

export default function request<T>(config: AxiosRequestConfig) {
	return new Promise<T>(async (resolve, reject) => {
		try {
			const res = await axiosInstance(config)
			resolve(res.data)
		} catch (error) {
			reject(error)
		}
	})
}
