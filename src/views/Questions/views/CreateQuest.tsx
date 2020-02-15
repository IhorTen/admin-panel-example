import React from "react"
import { RouteComponentProps, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { CreateQuestType } from "typings/Main"

import "styles/views/create-quest"

// Requests
import { createQuest } from "api/questions"

// Components / Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"

// Stores
import QuestsStore from "stores/QuestsStore"
import Notifications from "stores/Notifications"


export interface CreateQuestProps extends RouteComponentProps<any> {}

export interface CreateQuestState {
    createdQuests: CreateQuestType[],
    questionQuery: string,
    loading: boolean
}

export type Quest = {
    question_content: string,
    weight: string | number 
}

export default
class CreateQuest
extends React.Component<CreateQuestProps, CreateQuestState> {

    request = createQuest(this.props.match.params.id)

    state = {
        createdQuests: [] as CreateQuestType[],
        questionQuery: "",
        loading: false
    }

    componentDidMount() {
        // Writes created quizzes from localstorage in state
        let createdQuestsLS = JSON.parse(localStorage.getItem("created_questions"))

        if(createdQuestsLS)
            this.setState({
                createdQuests: createdQuestsLS
            })
    }

    componentWillUnmount() {
        // Deleted item from localstorage
        localStorage.removeItem("created_questions")
    }

    
    // Makes a request to the create question
    handleSubmit = () => {
        this.state.createdQuests.forEach(item => {
            item.weight = +item.weight
        })
        this.setState({
            loading: true
        })

        console.log("Send: ", this.state.createdQuests)

        this.request.run(this.state.createdQuests).then(res => {
            QuestsStore.addQuestions(res)
            Notifications.success("Questions created")
            this.props.history.push(`/quizzes/${this.props.match.params.id}`)
        }).catch(err => {
            Notifications.error(err.message)
            this.setState({
                loading: false
            })
        })
    }

    /**
     * Create new question item in modal window
     * @param data - data for created question
     */
    handleCreateQuest = (data: any) => {
        let { createdQuests } = this.state
        let questData = { question_content: data.question_content, weight: data.weight }

        this.setState({
            createdQuests: [...createdQuests, questData],
            questionQuery: ""
        }, this.saveCreatedQuestions)
    }

    
    // Saved created questions in localstorage
    saveCreatedQuestions = () => {
        localStorage.setItem("created_questions", JSON.stringify(this.state.createdQuests))
    }

    
    // Writes input value in state property questionQuery
    handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = event.currentTarget.value

        this.setState({
            questionQuery: value
        })
    }

    stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    render() {
        let { id } = this.props.match.params
        let { createdQuests, questionQuery } = this.state
        return <>
            <Modal
                onClose={() => {this.props.history.push(`/quizzes/${id}`)}}
                className="create-quest-modal"
            >
                <FormWrap onSubmit={this.handleCreateQuest}>
                    <p className="u-modal-title">
                        Create new question
                    </p>
                    <ul className="created-quests-list">
                        {createdQuests.map((item, i) => {
                            return (
                                <li key={i}>
                                    <div>
                                        <span className="created-quest-name">Qeustion: </span>
                                        <span>{ item.question_content }</span>
                                    </div>
                                    <div>
                                        <span className="created-quest-name">Weight: </span>
                                        <span>{ item.weight }</span>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="u-modal-inp-wrap">
                        {/* <input 
                            type="text"
                            className="u-modal-inp"
                            placeholder="Weight"
                            name="weight"
                            required
                        /> */}
                        <textarea 
                            name="question_content" 
                            className="u-modal-textarea"
                            value={questionQuery}
                            onChange={this.handleChange}
                            placeholder="Question"
                            required
                        />
                    </div>
                    <div className="u-modal-inp-wrap">
                        <select
                            className="create-quest-select"
                            name="weight"
                            placeholder="Weight"
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <button 
                        className="u-modal-btn create-quest-btn"
                        onClick={event => this.stopPropagation(event)}
                    >
                        Create
                    </button>
                    <button 
                        className="u-modal-btn"
                        onClick={this.handleSubmit}
                    >
                        {this.state.loading
                            ? <FontAwesomeIcon icon={faSpinner} spin />
                            : "Submit"
                        }
                    </button>
                </FormWrap>
            </Modal>
        </>
    }
}