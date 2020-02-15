import React from "react"
import { Link, RouteComponentProps, Redirect } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"

// Requests
import { editUser } from "api/users"

// Components / Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"
import Input from "components/Forms/Inputs/Default"

// Stores
import Notifications from "stores/Notifications"
import UsersStore from "stores/UsersStore"

export type EditUserResponse = {
    status: string,
    message: string
}

export interface EditUserProps extends RouteComponentProps<any> {}

export interface EditUserState {
    loading: boolean
}

export default
class EditUser
extends React.Component<EditUserProps, EditUserState> {
    request = editUser(this.props.match.params.userId)

    state = {
        loading: false
    }

    /**
     * Makes a request to the edit user
     * @param data - Changed user data
     */
    handleSubmit = (data: { email: string }) => {
        this.setState({
            loading: true
        })

        // Request on edited user
        this.request.run(data).then(res => {
            Notifications.success("User successfully edited")
            UsersStore.editUser(res)
            console.log(res)
            this.props.history.push("/users")
        }).catch(err => {
            Notifications.error("Error!")
            console.log(err)
            this.setState({
                loading: false
            })
        })
    }

    render() {
        if(UsersStore.usersList)
            var currentUser = UsersStore.getUserById(this.props.match.params.userId)
        if(!currentUser)
            return <Redirect to="/users"/>
            
        return <>
            <Modal
                className="create-user-modal"
                onClose={() => {this.props.history.push("/users")}}
            >
                <FormWrap onSubmit={this.handleSubmit}>
                    <p className="u-modal-title">
                        Edit User
                    </p>
                    <div className="u-modal-inp-wrap">
                        {/* <input 
                            type="text"
                            className="u-modal-inp"
                            placeholder="E-mail"
                            name="email"
                            defaultValue={currentUser.email}
                            required
                        /> */}
                        <Input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            required
                            renderInvalidMessage={key => {
                                switch(key) {
                                    case "valueMissing":
                                        return "Please enter quiz type"
                                    case "patternMismatch":
                                        return "Please enter valid quiz type"
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
                            event.nativeEvent.stopImmediatePropagation()
                        }}
                    >
                        {this.state.loading
                            ? <FontAwesomeIcon icon={faSpinner} spin />
                            : "Edit"
                        }
                    </button>
                </FormWrap>
            </Modal>
        </>
    }
}