import { format } from 'date-fns'
import { encode } from 'js-base64'
import md5 from 'md5'
import { ExpNextApiRequest, ExpNextApiResponse } from 'types/common'
import { withIronSessionApiRoute } from 'iron-session/next'
import axios, { AxiosResponse } from 'axios'
import { AppSession } from '../_types'
import { SendAuthCodeBody } from './types'

export default withIronSessionApiRoute(send, {
	cookieName: 'myapp_cookiename',
	password: 'complex_password_at_least_32_characters_long',
	// secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
	cookieOptions: {
		maxAge: 24 * 60 * 60 * 1000,
		secure: process.env.NODE_ENV === 'production',
	},
})

async function send(req: ExpNextApiRequest<SendAuthCodeBody>, res: ExpNextApiResponse) {
	const { phoneNumber: to, templateId = '1' } = req.body

	if (!to)
		res.status(200).json({
			code: 400,
			message: '手机号不能为空',
			data: null,
		})

	const AccountSid = '8aaf0708806f236e018084c0876c03d5'
	const AuthToken = '0c60ba0c379249e6853f4e280884f9ff'
	const nowTime = format(new Date(), 'yyyyMMddHHmmss')
	const SigParameter = md5(`${AccountSid}${AuthToken}${nowTime}`)
	const Authorization = encode(`${AccountSid}:${nowTime}`)
	const authCode = Math.floor(Math.random() * 100000)

	const URL = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountSid}/SMS/TemplateSMS?sig=${SigParameter}`

	axios({
		url: URL,
		method: 'POST',
		data: {
			to,
			templateId,
			appId: '8aaf0708806f236e018084c0889503dc',
			datas: [authCode, '5'],
		},
		headers: { Authorization },
	}).then((result: AxiosResponse<{ statusMsg: string; statusCode: string }>) => {
		const { statusMsg, statusCode } = result.data
		const isError = parseInt(statusCode) !== 0

		const session: AppSession<{ authCode?: number }> = req.session
		session.authCode = authCode
		session.save()

		res.status(200).json({
			code: isError ? parseInt(statusCode) : 0,
			data: null,
			message: statusMsg || 'success',
		})
	})
}
