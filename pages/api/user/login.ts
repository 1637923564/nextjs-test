import { ExpNextApiRequest, ExpNextApiResponse } from 'types/common'
import { LoginBody } from './types'

export default async function login(req: ExpNextApiRequest<LoginBody>, res: ExpNextApiResponse) {
	const { account, authCode } = req.body

	res.status(200).json({
		code: 0,
		data: null,
		message: 'success',
	})
}
