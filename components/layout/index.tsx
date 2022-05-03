import { NextPage } from 'next'
import { Fragment } from 'react'
import Footer from './footer'
import Navbar from './navbar'

const Layout: NextPage<{ children }> = ({ children }) => {
	return (
		<Fragment>
			<div>
				<Navbar />
				<main>{children}</main>
				<Footer />
			</div>
		</Fragment>
	)
}

export default Layout
