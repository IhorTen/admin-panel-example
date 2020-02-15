import React from "react"
import { RouteComponentProps } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

import "styles/components/modals/delete-quiz"

// Requests
import { deleteQuest } from "api/questions"

// Components / Views
import Modal from "components/Modals/Default"

// Stores
import QuestsStore from "stores/QuestsStore"
import Notifications from "stores/Notifications"

export interface DeleteQuestProps extends RouteComponentProps<any> {}

export interface DeleteQuestState {
    loading: boolean
}

export default
class DeleteQuest
extends React.Component<DeleteQuestProps, DeleteQuestState> {
    request = deleteQuest(this.props.match.params.id, this.props.match.params.questId)

    state = {
        loading: false
    }

    componentWillUnmount() {
        // Abort requests on delete question
        this.request.abort()
    }

    
    // Makes a request to the delete question
    handleClick = () => {
        let { questId, id } = this.props.match.params
        let { getQuestById, removeSelected, checkedRows } = QuestsStore
        let currentQuest = getQuestById(questId)

        this.setState({
            loading: true
        })

        if(questId == "all") {
            removeSelected()
        } else {
            if(currentQuest) {
                var selectIndex = checkedRows.indexOf(currentQuest.question_id)
            }
            if(selectIndex >= 0)
                checkedRows.splice(selectIndex, 1)
        }

        this.request.run().then(res => {
            Notifications.success(res.message)
            QuestsStore.removeQuest(this.props.match.params.questId)
            this.props.history.push(`/quizzes/${id}`)
        }).catch(err => {
            Notifications.error(err.message)
            this.setState({
                loading: false
            })
        })

    }

    render() {
        let { id } = this.props.match.params
        return <>
            <Modal
                onClose={() => {this.props.history.push(`/quizzes/${this.props.match.params.id}`)}}
                className="delete-quest-modal"
            >
                <form className="delete-test-form">
                    <p className="delete-test-title">
                        { this.props.match.params.id == "all"
                            ? "Delete Questions?"
                            : "Delete Question?"
                        }
                    </p>
                    <div className="delete-test-btns">
                        <button 
                            className="del-test-btn color-main-bg"
                            type="submit"
                            onClick={this.handleClick}
                        >
                            {this.state.loading
                                ? <FontAwesomeIcon icon={faSpinner} spin />
                                : "Yes"
                            }
                        </button>
                        <Link to={`/quizzes/${this.props.match.params.id}`}>
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