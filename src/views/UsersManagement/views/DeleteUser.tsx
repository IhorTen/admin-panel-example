import React from "react"
import { Link, RouteComponentProps } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"

// Requests
import { deleteUser } from "api/users"

// Components / Views
import Modal from "components/Modals/Default"

// Stores
import UsersStore from "stores/UsersStore"
import Notifications from "stores/Notifications"

export interface DeleteUserProps extends RouteComponentProps<any> {}

export interface DeleteUserState {
    loading: boolean
}

export default
class DeleteUser
extends React.Component<DeleteUserProps, DeleteUserState> {
    request = deleteUser(this.props.match.params.userId)

    state = {
        loading: false
    }
    
    // Makes a request to the delete user
    handleClick = () => {
        let currentUser = UsersStore.getUserById(this.props.match.params.userId)
        this.setState({
            loading: true
        })

        this.request.run().then(res => {
            Notifications.success(res.message)
            if(currentUser)
                UsersStore.removeUser(currentUser)
            console.log(res)
            this.props.history.push("/users")
        }).catch(err => {
            Notifications.error("User not found")
            console.log(err)
            this.setState({
                loading: false
            })
        })
    }

    render() {
        return <>
            <Modal
                className="delete-user-modal"
                onClose={() => {this.props.history.push("/users")}}
            >
                <form className="delete-test-form">
                    <p className="delete-test-title">
                        Delete user?
                    </p>
                    <div className="delete-test-btns">
                        <button 
                            className="del-test-btn color-main-bg"
                            type="button"
                            onClick={this.handleClick}
                        >
                            {this.state.loading
                                ? <FontAwesomeIcon icon={faSpinner} spin />
                                : "Yes"
                            }
                        </button>
                        <Link to={`/users`}>
                            <button 
                                className="del-test-btn negative-bg"
                                type="button"
                            >
                                No
                            </button>
                        </Link>
                    </div>
                </form>
            </Modal>
        </>
    }
}