import { Button, Form, FormProps, Input, message, Modal, Tooltip } from 'antd'
import { NextPage } from 'next'
import { LoginBody } from 'pages/api/user/types'
import { ReactNode, useState } from 'react'
import { login, sendAuthCode } from './api'
import styles from './style/index.module.scss'

interface LoginProps {
	visible: boolean
	onClose?: () => void
}

const layout: FormProps & { children?: ReactNode } = {
	labelCol: {
		span: 5,
	},
}

const formInitialValues = {
	account: '13540147134',
	authCode: '1111',
}

const Login: NextPage<LoginProps> = (props) => {
	const [form] = Form.useForm<LoginBody>()

	const close = () => {
		const { onClose } = props
		onClose && onClose()
	}

	// 确认登录
	const [loginLoading, setLoginLoading] = useState(false)
	const confirm = () => {
		form
			.validateFields()
			.then(async (e) => {
				await login(form.getFieldsValue(), setLoginLoading)
				message.success('登录成功')
				close()
			})
			.catch(() => {})
	}

	const checkPhoneNumber = (rules, value: string) => {
		if (value.length === 0 || value.length === 11) return Promise.resolve()
		else return Promise.reject(new Error('手机号码格式错误'))
	}

	//* 获取验证码
	const [disableGetAuthCode, setDisableGetAuthCode] = useState(false)
	const [authCodeButtonLoading, setAuthCodeButtonLoading] = useState(false)
	const [authCodeTimer, setAuthCodeTimer] = useState(15)
	const getAuthCode = () => {
		if (!disableGetAuthCode) {
			sendAuthCode({ phoneNumber: form.getFieldValue('account') }, setAuthCodeButtonLoading).then(() => {
				setDisableGetAuthCode(true)
				message.success('验证码已发送，请注意查收')
				const interval = setInterval(() => {
					setAuthCodeTimer((timer) => {
						if (timer <= 1) {
							clearInterval(interval)
							setDisableGetAuthCode(false)
							return authCodeTimer
						}
						return timer - 1
					})
				}, 1000)
			})
		}
	}

	return (
		<>
			<Modal title="登录" visible={props.visible} width={400} centered footer={null}>
				<div className={styles.loginWrap}>
					<Form form={form} {...layout} initialValues={formInitialValues} style={{ width: '100%' }} onFinish={confirm}>
						<Form.Item
							name="account"
							label="手机号码"
							rules={[{ required: true, message: '请输入手机号码' }, { validator: checkPhoneNumber }]}
						>
							<Input autoComplete="off" />
						</Form.Item>
						<Form.Item label="验证码" required>
							<Input.Group compact style={{ display: 'flex' }}>
								<Form.Item
									name="authCode"
									rules={[{ required: true, message: '请输入验证码' }]}
									style={{ marginBottom: 0, flex: 1 }}
								>
									<Input />
								</Form.Item>
								<Button
									type="primary"
									loading={authCodeButtonLoading}
									onClick={getAuthCode}
									disabled={disableGetAuthCode}
									style={{ minWidth: '102px' }}
								>
									{disableGetAuthCode ? `${authCodeTimer}s` : '获取验证码'}
								</Button>
							</Input.Group>
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loginLoading}>
								Submit
							</Button>
						</Form.Item>
					</Form>

					<div className={styles.otherLogin}>
						<Tooltip title="Github登录">
							<i className="iconfont icon-githubb"></i>
						</Tooltip>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default Login
