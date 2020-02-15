import React from "react"
import {observer} from "mobx-react"
import {RouteComponentProps} from "react-router"
import {Link} from "react-router-dom"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import "styles/views/create-quiz"

//Requests
import {createQuiz} from "api/quizzes"

//Components/Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"
import Input from "components/Forms/Inputs/Default"

//Stores
import QuizzesStore from "stores/QuizzesStore"
import Notifications from "stores/Notifications"

export interface CreateQuizProps extends RouteComponentProps<any> {}

export interface CreateQuizState {
    loading: boolean,
    rangeValue: number
}

@observer
export default
class CreateTest
extends React.Component<CreateQuizProps, CreateQuizState> {
    request = createQuiz()

    state = {
        loading: false,
        rangeValue: 0
    }

    componentWillUnmount() {
        this.request.abort()
    }

    /**
     * Makes a request to the create quiz
     * @param data - Quiz data
     */
    handleSubmit = (data: any) => {
        data.duration = +data.duration
        console.log(data)
        this.setState({
            loading: true
        })

        this.request.run(data).then(res => {
            QuizzesStore.addQuizzes(res)
            Notifications.success("Quiz created")
            this.props.history.push("/quizzes")
        }).catch(err => {
            Notifications.error(err.message)
            console.log(err)
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
        let { index } = this.props.match.params
        return <>
            <Modal
                className="create-test-modal"
                onClose={() => {this.props.history.push("/quizzes")}}
            >
                <FormWrap onSubmit={this.handleSubmit}>
                    <p className="u-modal-title">
                        Create new test
                    </p>
                    <div className="u-modal-inp-wrap">
                        <Input 
                            name="name"
                            placeholder="Quiz name"
                            pattern="[A-Za-z0-9][A-Za-z0-9-\s]*"
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
                            required
                        />
                    </div>
                    <div className="u-modal-inp-wrap">
                        <Input 
                            name="type"
                            placeholder="Type quiz"
                            pattern="[A-Za-z0-9][A-Za-z0-9-\s]*"
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
                            : "Create"
                        }
                    </button>
                </FormWrap>
            </Modal>
        </>
    }
}