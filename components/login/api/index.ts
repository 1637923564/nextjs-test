import { LoginBody, SendAuthCodeBody } from 'pages/api/user/types'
import { Dispatch, SetStateAction } from 'react'
import request from 'tools/request'

export const sendAuthCode = (data: SendAuthCodeBody, loadingSetter: Dispatch<SetStateAction<boolean>>) => {
	return request({
		url: '/api/user/sendAuthCode',
		data,
		method: 'POST',
		loadingSetter,
	})
}

export const login = (data: LoginBody, loadingSetter: Dispatch<SetStateAction<boolean>>) => {
	return request({
		url: '/api/user/login',
		data,
		method: 'POST',
		loadingSetter,
	})
}
