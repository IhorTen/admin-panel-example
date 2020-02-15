import React from "react"
import Helmet from "react-helmet"
import { Switch, Route } from "react-router-dom"
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

import "typings/Number"

import Application from "./App"

export interface ProviderProps {}
export interface ProviderState {}

export default
class AppProvider
extends React.Component<ProviderProps, ProviderState> {
	render() {
		return <>
			<Helmet>
				<title> The Cognitive CMS </title>
				<link 
					rel="stylesheet" 
					href="https://use.fontawesome.com/releases/v5.11.2/css/all.css" 
					integrity="sha384-KA6wR/X5RY4zFAHpv/CnoG2UW1uogYfdnP67Uv7eULvTveboZJg0qUpmJZb5VqzN" 
					crossOrigin="anonymous" 
				/>
			</Helmet>
			<MuiPickersUtilsProvider utils={MomentUtils}>
				<Switch>
					<Route path="/" component={Application} />
				</Switch>
			</MuiPickersUtilsProvider>
		</>
	}
}