import { Button, Form, FormProps, Input, message, Modal, Tooltip } from 'antd'
import { NextPage } from 'next'
import { ReactNode, useState } from 'react'
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
	account: '13547271471',
	authCode: '1111',
}

const Login: NextPage<LoginProps> = (props) => {
	const [form] = Form.useForm()

	const close = () => {
		const { onClose } = props
		onClose && onClose()
	}
	const confirm = () => {
		form
			.validateFields()
			.then((e) => {
				console.log('ok', form.getFieldsValue(), e)
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
	const [authCodeTimer, setAuthCodeTimer] = useState(6)
	const getAuthCode = () => {
		if (!disableGetAuthCode) {
			setDisableGetAuthCode(true)
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
		}
	}

	return (
		<>
			<Modal
				title="登录"
				visible={props.visible}
				onCancel={close}
				onOk={confirm}
				okText="登录"
				cancelText="取消"
				width={400}
				centered
			>
				<div className={styles.loginWrap}>
					<Form form={form} {...layout} initialValues={formInitialValues} style={{ width: '100%' }}>
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
