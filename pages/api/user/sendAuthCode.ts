import { format } from 'date-fns'
import { encode } from 'js-base64'
import md5 from 'md5'
import { NextApiRequest, NextApiResponse } from 'next'
import request from 'tools/request'

export default async function send(req: NextApiRequest, res: NextApiResponse) {
	const { phoneNumber: to, templateId = '1' } = req.body

	if (!to)
		res.status(400).json({
			msg: '手机号不能为空',
		})

	const AccountSid = '8aaf0708806f236e018084c0876c03d5'
	const AuthToken = '0c60ba0c379249e6853f4e280884f9ff'
	const nowTime = format(new Date(), 'yyyyMMddHHmmss')
	const SigParameter = md5(`${AccountSid}${AuthToken}${nowTime}`)
	const Authorization = encode(`${AccountSid}:${nowTime}`)

	const URL = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountSid}/SMS/TemplateSMS?sig=${SigParameter}`

	request({
		url: URL,
		method: 'POST',
		data: {
			to,
			templateId,
			appId: '8aaf0708806f236e018084c0889503dc',
			datas: [Math.floor(Math.random() * (9999 - 1000)) + 1000, '5'],
		},
		headers: {
			Authorization,
		},
	}).then(() => {
		res.status(200).json({
			code: 0,
			data: null,
			msg: 'success',
		})
	})
}
