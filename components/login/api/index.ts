import request from 'tools/request'

export const sendAuthCode = (data: { phoneNumber: string }) => {
	return request({
		url: '/api/user/sendAuthCode',
		data,
		method: 'POST',
	})
}
