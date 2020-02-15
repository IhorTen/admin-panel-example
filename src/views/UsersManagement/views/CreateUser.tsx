import React from "react"
import { Link, RouteComponentProps } from "react-router-dom"
import { User } from "typings/Main"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"

// Requests
import { createUser } from "api/users"

// Components / Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"
import Input from "components/Forms/Inputs/Default"

// Stores
import Notifications from "stores/Notifications"
import UsersStore from "stores/UsersStore"

export interface CreateUserProps extends RouteComponentProps<any> {}

export interface CreateUserState {
    loading: boolean
}

export default
class CreateUser
extends React.Component<CreateUserProps, CreateUserState> {
    request = createUser()

    state = {
        loading: false
    }
    
    /**
     * Makes a request to the create user
     * @param data - User data for created new user (email and password)
     */
    handleSubmit = (data: User) => {
        console.log(data)

        this.setState({
            loading: true
        })

        // Request on created user
        this.request.run(data).then(res => {
            Notifications.success("User successfully created")
            UsersStore.addUser(res)
            console.log(res)
            this.props.history.push("/users")
        }).catch(err => {
            if(err.message == "CONFLICT")
                Notifications.error("Such user e exists")
            else
                Notifications.error(err.message)
            console.log(err)
            this.setState({
                loading: false
            })
        })
    }

    render() {
        return <>
            <Modal
                className="create-user-modal"
                onClose={() => this.props.history.push("/users")}
            >
                <FormWrap onSubmit={this.handleSubmit}>
                    <p className="u-modal-title">
                        Create new user
                    </p>
                    <div className="u-modal-inp-wrap">
                        {/* <input
                            type="text"
                            className="u-modal-inp"
                            placeholder="Email"
                            name="email"
                            required
                        /> */}
                        <Input
                            name="email"
                            placeholder="Email"
                            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            required
                            renderInvalidMessage={key => {
                                switch(key) {
                                    case "valueMissing":
                                        return "Please enter email"
                                    case "patternMismatch":
                                        return "Please enter valid email"
                                    default:
                                        return key
                                }
                            }}
                        />
                    </div>
                    <div className="u-modal-inp-wrap">
                        <input
                            type="text"
                            className="u-modal-inp"
                            placeholder="Password"
                            name="password"
                            required
                        />
                    </div>
                    <button
                        className="u-modal-btn"
                        onClick={event => {
                            event.stopPropagation()
                            event.nativeEvent.stopPropagation()
                        }}
                    >
                        {this.state.loading
                            ? <FontAwesomeIcon icon={faSpinner} spin />
                            : "Create"
                        }
                    </button>
                </FormWrap>
            </Modal>
        </>
    }
}