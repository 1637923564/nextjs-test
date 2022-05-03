import { Button } from 'antd'
import Login from 'components/login/Login'
import { NextPage } from 'next'
import { useState } from 'react'
import styles from './style/index.module.scss'

const Navbar: NextPage = () => {
	const [loginVisible, setLoginVisible] = useState(false)
	const [loginKey, setLoginKey] = useState(0)

	const openLogin = () => {
		setLoginVisible(true)
		setLoginKey(Date.now())
	}

	return (
		<>
			<nav id={styles.nav}>
				<section className={styles.buttons_wrap}>
					<Button>写文章</Button>
					<Button type="primary" onClick={openLogin}>
						登录
					</Button>
				</section>
			</nav>
			<Login visible={loginVisible} onClose={() => setLoginVisible(false)} key={loginKey} />
		</>
	)
}

export default Navbar
