import { NextApiRequest, NextApiResponse } from 'next'

export interface Res<T> {
	code: number
	data?: T
	message: string
}

export interface ExpNextApiRequest<T = any> extends NextApiRequest {
	body: T
}

export type ExpNextApiResponse<T = any> = NextApiResponse<Res<T>>
