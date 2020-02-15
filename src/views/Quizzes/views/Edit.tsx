import React from "react"
import { observer } from "mobx-react"
import { RouteComponentProps, Redirect } from "react-router"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"

import "styles/views/create-quiz"

//Stores
import QuizzesStore from "stores/QuizzesStore"
import Notifications from "stores/Notifications"

//Requests
import {editQuiz} from "api/quizzes"

//Components/Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"
import Input from "components/Forms/Inputs/Default"

export interface EditQuizProps extends RouteComponentProps<any> {}

export interface EditQuizState {
    loading: boolean,
    rangeValue: number
}

@observer
export default
class EditQuiz
extends React.Component<EditQuizProps, EditQuizState> {
    request = editQuiz(this.props.match.params.id)

    state = {
        loading: false,
        rangeValue: 0
    }

    componentWillUnmount() {
        this.request.abort()
    }

    // Makes a request to the edit quiz
    handleSubmit = (data: any) => {
        data.duration = +data.duration
        console.log("Edit quiz:", data)
        this.setState({
            loading: true
        })

        this.request.run(data).then(res => {
            QuizzesStore.editQuiz(res)
            Notifications.success("Quiz created")
            this.props.history.push("/quizzes")
        }).catch(err => {
            Notifications.error("Error")
            console.log(err.message)
            this.setState({
                loading: false
            })
        })
    }

    rangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            rangeValue: +event.currentTarget.value / 60
        })
    }

    render() {
        let { id } = this.props.match.params
        if(QuizzesStore.quizzes)
            var currentQuiz = QuizzesStore.getTestById(id)
        if(!currentQuiz)
            return <Redirect to="/quizzes"/>
        return <>
            <Modal
                onClose={() => {this.props.history.push(`/quizzes`)}}
                className="create-test-modal"
            >
                <FormWrap onSubmit={this.handleSubmit}>
                    <p className="u-modal-title">
                        Edit Test
                    </p>
                    <div className="u-modal-inp-wrap">
                        <Input 
                            name="name"
                            defaultValue={currentQuiz.name}
                            placeholder="Quiz name"
                            // pattern="[A-Za-z0-9][A-Za-z0-9-\s]*"
                            required
                            renderInvalidMessage={key => {
                                switch(key) {
                                    case "valueMissing":
                                        return "Please enter quiz name"
                                    case "patternMismatch":
                                        return "Please enter valid quiz name"
                                    default:
                                        return key
                                }
                            }}
                        />
                    </div>
                    <div className="u-modal-inp-wrap">
                        <textarea 
                            name="description" 
                            placeholder="Quiz description"
                            defaultValue={currentQuiz.description}
                            required
                        />
                    </div>
                    <div className="u-modal-inp-wrap">
                        <Input 
                            name="type"
                            defaultValue={currentQuiz.type}
                            placeholder="Type quiz"
                            // pattern="[A-Za-z0-9][A-Za-z0-9-\s]*"
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
                            name="duration"
                            onChange={this.rangeChange}
                            className="range"
                            type="range"
                            defaultValue="0"
                            min="0"
                            max="3600"
                            step="60"
                        />
                        <span className="duration">
                            {this.state.rangeValue} min
                        </span>
                    </div>
                    <button 
                        className="u-modal-btn"
                        onClick={(event: React.MouseEvent) => {
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