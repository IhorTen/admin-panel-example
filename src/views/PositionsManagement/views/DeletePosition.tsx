import React from "react"
import { Link, RouteComponentProps } from "react-router-dom"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

//Requests
import { deletePostion } from "api/positions"

//Components / Views
import Modal from "components/Modals/Default"

//Stores
import PositionsStore from "stores/PositionsStore"
import Notifications from "stores/Notifications"

export interface DeletePositionProps extends RouteComponentProps<any> {}

export interface DeletePositionState {
    loading: boolean
}

export default
class DeletePosition
extends React.Component<DeletePositionProps, DeletePositionState> {

    request = deletePostion(this.props.match.params.positionId)

    state = {
        loading: false
    }
    
    // Makes a request to delete a position
    handleClick = () => {
        this.setState({
            loading: true
        })
        this.request.run().then(res => {
            Notifications.success(res.message)
            PositionsStore.removePosition(this.props.match.params.positionId)
            this.props.history.push("/positions")
        }).catch(err => {
            Notifications.error(err.message)
            this.setState({
                loading: false
            })
        })
    }

    componentWillUnmount() {
        // Abort requests on delete position
        this.request.abort()
    }

    render() {
        return <>
            <Modal
                className="delete-position-modal"
                onClose={() => {this.props.history.push("/positions")}}
            >
                <form className="delete-test-form">
                    <p className="delete-test-title">
                        Delete position?
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
                        <Link to={`/positions`}>
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