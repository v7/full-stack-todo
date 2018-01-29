import React from 'react'
import {Redirect, Route} from 'react-router-dom'
const Private = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		rest.auth ? (
			<Component checkAuth={rest.checkAuth} user={rest.user} {...props} />
		) : (
			<Redirect to={{
				pathname: '/',
				state: { from: props.location }
			}} />
		)
	)} />
)

export default Private
