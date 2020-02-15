import React from "react"
import { RouteComponentProps, Switch, Route, Redirect } from "react-router-dom"
import { observer } from "mobx-react"
//Stores
import AuthStore from "stores/AuthStore"
import NotificationsStore from "stores/Notifications"
//Requests
import { protectedReq } from "api/protected"
//Components/Views
import NotFound from "views/NotFound"
import SignIn from "views/SignIn"
import Results from "views/Results"
import Quizzes from "views/QuizzesManagement"
import Mails from "views/MessageMail"
import Header from "components/Header"
import Sidebar from "components/Sidebar"
import Spinner from "components/Preloaders/Spinner"
import UsersManagement from "views/UsersManagement"
import PositionsManagement from "views/PositionsManagement"
import Notifications from "components/Notifications"
import ErrorHandling from "components/Misc/ErrorHandling"
import SmsPage from "views/MessageSms"

import "styles/fonts"
import "styles/main"
import "styles/universal"


export interface ApplicationProps extends RouteComponentProps<any> { }
export interface ApplicationState { 
	isMenuOpen: boolean
 }

@observer
export default
class Application
extends React.Component<ApplicationProps, ApplicationState> {
	state = {
		isMenuOpen: false
	}

	componentDidMount() {
		// Makes a request for user verification
		protectedReq().run().then(res => {
			AuthStore.login(res)
		}).catch(err => {
			// AuthStore.logout()
		})
	}

	componentWillUnmount() {
		NotificationsStore.clear()
	}

	handleClick = () => {
		this.setState({
			isMenuOpen: !this.state.isMenuOpen
		})
	}

	handleCloseSidebar = () => {
		this.setState({
			isMenuOpen: false
		})
	}

	render() {
		let { isMenuOpen } = this.state
		if (!AuthStore.isChecked)
			return <Spinner />
		if (!AuthStore.isLogged)
			return <SignIn {...this.props} />
			
		return <>
			<ErrorHandling>
				<div className="app-flex">
					<Header
						onClick={this.handleClick}
						isOpen={isMenuOpen}
						{...this.props} 
					/>
					<Sidebar 
						{...this.props} 
						isOpen={isMenuOpen}
						onClose={this.handleCloseSidebar}
					/>
					<Switch>
						<Route
							path="/"
							exact
							render={() => {
								return <Redirect to="/results" />
							}}
						/>
						<Route
							path="/results"
							exact
							render={props => <Results {...props} key="theadmasters" />}
						/>
						<Route
							path="/quizzes"
							component={Quizzes}
						/>
						<Route
							path="/users"
							component={UsersManagement}
						/>
						<Route
							path="/positions"
							component={PositionsManagement}
						/>
						<Route
							path="/mails"
							component={Mails}
						/>
						<Route
							path="/sms"
							component={SmsPage}
						/>
						<Route component={NotFound} />
					</Switch>
					<Notifications />
				</div>
			</ErrorHandling>
		</>
	}
}