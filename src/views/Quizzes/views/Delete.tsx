import React from "react"
import { RouteComponentProps } from "react-router"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"

import "styles/components/modals/delete-quiz"

//Requests
import { deleteQuiz, quizzes } from "api/quizzes"

//Components/Views
import Modal from "components/Modals/Default"

// Stores
import QuizzesStore from "stores/QuizzesStore"
import Notifications from "stores/Notifications"

export interface DeleteQuizProps extends RouteComponentProps<any> {}

export interface DeleteQuizState {
    loading: boolean
}

export default
class DeleteQuiz
extends React.Component<DeleteQuizProps, DeleteQuizState> {
    request = deleteQuiz(this.props.match.params.id)

    state = {
        loading: false
    }

    componentWillUnmount() {
        this.request.abort()
    }

    // Makes a request to the delete quiz
    handleClick = () => {
        // Quiz id
        let { id } = this.props.match.params
        // Array selected elements
        let { checkedRows } = QuizzesStore
        // Current quiz
        let currentTest = QuizzesStore.getTestById(id)
        // Index selected element
        let checkIndex = checkedRows.findIndex(indexElement => {
            return id == indexElement
        })

        if(id == "all")
            QuizzesStore.removeSelected()
        if(checkIndex >= 0) 
            checkedRows.splice(checkIndex, 1)
        if(currentTest)
            QuizzesStore.removeTest(currentTest)

        this.setState({
            loading: true
        })

        // Request on quizzes list
        this.request.run().then(res => {
            quizzes().run().then(res => {
                QuizzesStore.setTestList(res)
                this.props.history.push("/quizzes")
            }).catch(err => {
                console.log(err)
            })
            Notifications.success(res.message)
        }).catch(err => {
            Notifications.success(err.message)
            console.log(err)
            this.setState({
                loading: false
            })
        })
    }

    render() {
        return <>
            <Modal
                onClose={() => {this.props.history.push(`/quizzes`)}}
                className="delete-test-modal"
            >
                <form className="delete-test-form">
                    <p className="delete-test-title">
                        { this.props.match.params.id == "all"
                            ? "Delete Tests?"
                            : "Delete Test?"
                        }
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
                        <Link to="/quizzes">
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