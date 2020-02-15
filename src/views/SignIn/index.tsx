import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { observer } from "mobx-react"
import Request, { ResponseError } from "superagent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

import "styles/views/sign-in"

// Requests
import { protectedReq } from "api/protected"

// Components / Views
import FormWrap from "components/Forms/FormWrap"
import Notifications from "components/Notifications"
import { API_PRODUCTION_HOST } from "consts"
import Input from "components/Forms/Inputs/Default"

// Stores
import AuthStore from "stores/AuthStore"
import NotificationsStore from "stores/Notifications"

export interface SignInProps extends RouteComponentProps<any> {}

export interface SignInState {
    loading: boolean
}

@observer
export default
class SignIn
extends React.Component<SignInProps, SignInState> {

    state = {
        loading: false
    }

    componentDidMount() {
        // Clear notifications list
        NotificationsStore.clear()
    }

    /**
     * Makes a request for user login and writes user data in AuthStore
     * @param data - user data for server request
     */
    handleSubmit = (data: any) => {
        event.preventDefault()
        this.setState({
            loading: true
        })

        Request
            .post(`${API_PRODUCTION_HOST}auth/sign-in`)
            .send(data)
            .then(res => {
                AuthStore.setTokens(res.body.access_token, res.body.refresh_token)

                protectedReq().run().then(res => {
                    AuthStore.login(res)
                }).catch(err => {
                    AuthStore.logout()
                })

                NotificationsStore.success("Success")
            }).catch((err: ResponseError) => {
                var status = err.status
                if(status == 401) {
                    NotificationsStore.error("Incorrect email or password")
                } else if (status >= 500) {
                    NotificationsStore.error("Server error, please try again later")
                } else {
                    NotificationsStore.error("Error!")
                }
                this.setState({
                    loading: false
                })
            })

        return false
    }

    render() {
        return <>
            <main className="v-sign-in">
                <div className="container">
                    <div className="admin-log-flex">
                        <FormWrap
                            className="a-log-form"
                            onSubmit={this.handleSubmit}
                        >
                            <h1 className="a-form-title">
                                Sign in
                            </h1>
                            <div className="sign-inp-wrap">
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="E-mail"
                                    className="sign-inp"
                                    required
                                    renderInvalidMessage={key => {
                                        switch(key) {
                                            case "valueMissing":
                                                return "Please type email"
                                            case "patternMismatch":
                                                return "Wrong email"
                                            default:
                                                return key
                                        }
                                    }}
                                />
                            </div>
                            <div className="sign-inp-wrap">
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="sign-inp"
                                    required
                                    renderInvalidMessage={key => {
                                        switch(key) {
                                            case "valueMissing":
                                                return "Please type password"
                                            case "patternMismatch":
                                                return "Wrong password"
                                            default:
                                                return key
                                        }
                                    }}
                                />
                            </div>
                            <button className="form-admin-btn">
                                {this.state.loading
                                    ? <FontAwesomeIcon icon={faSpinner} spin pulse />
                                    : "Sign in"
                                }
                            </button>
                        </FormWrap>
                    </div>
                </div>
                <Notifications />
            </main>
        </>
    }
}