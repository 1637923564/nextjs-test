import { message } from 'antd'
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Dispatch, SetStateAction } from 'react'
import { Res } from 'types/common'

export interface ExpAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
	loadingSetter?: Dispatch<SetStateAction<boolean>>
}

const axiosInstance = axios.create({
	baseURL: '/',
})

// 添加请求拦截器
axiosInstance.interceptors.request.use(
	(config: ExpAxiosRequestConfig) => {
		config.loadingSetter && config.loadingSetter(true)
		return config
	},
	(error) => Promise.reject(error)
)

// 添加响应拦截器
axiosInstance.interceptors.response.use(
	(response: AxiosResponse<Res<any>>) => {
		const config: ExpAxiosRequestConfig = response.config
		config.loadingSetter && config.loadingSetter(false)
		return response
	},
	(error) => Promise.reject(error)
)

export default function request<T = any, D = any, R = unknown>(config: ExpAxiosRequestConfig<D>) {
	return new Promise<R & Res<T>>(async (resolve, reject) => {
		try {
			const res = await (axiosInstance(config) as AxiosPromise<Res<T> & R>)
			if (!res.data.code) {
				resolve(res.data)
			} else {
				message.error(res.data.message)
			}
		} catch (error) {
			reject(error)
		}
	})
}
