export interface SendAuthCodeBody {
	phoneNumber: string
	templateId?: '1'
}

export interface LoginBody {
	account: string
	authCode: string
}
