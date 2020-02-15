import React from "react"
import { observer } from "mobx-react"
import { RouteComponentProps, Redirect } from "react-router"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"

import "styles/views/edit-quest.sass"

// Requests
import { editQuestion } from "api/questions"

// Components / Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"

// Stores
import QuestsStore from "stores/QuestsStore"
import Notifications from "stores/Notifications"

export interface EditQuestProps extends RouteComponentProps<any> {}

export interface EditQuestState {
    loading: boolean
}

@observer
export default
class EditQuest
extends React.Component<EditQuestProps, EditQuestState> {
    request = editQuestion(this.props.match.params.id, this.props.match.params.questId)

    state = {
        loading: false
    }

    componentWillUnmount() {
        // Abort requests on edit question
        this.request.abort()
    }

    /**
     * Makes a request to the edit question
     * @param data - changed question data
     */
    handleSubmit = (data: {question_content: string, weight: number}) => {
        let { id, questId } = this.props.match.params
        data.weight = +data.weight

        this.setState({
            loading: true
        })

        this.request.run(data).then(res => {
            Notifications.success("Question updated")
            console.log("Questions", res)
            QuestsStore.editQuestion(res)
            this.props.history.push(`/quizzes/${id}`)
        }).catch(err => {
            Notifications.error(err.message)
            console.log(err)
            this.setState({
                loading: false
            })
        })
    }

    render() {
        let { questId, id } = this.props.match.params
        if(QuestsStore) {
            var currentQuest = QuestsStore.getQuestById(questId)
        }
        if(!currentQuest)
            return <Redirect to={`/quizzes`}/>

        return <>
            <Modal
                onClose={() => {this.props.history.push(`/quizzes/${id}`)}}
                className="edit-quest-modal"
            >
                <FormWrap onSubmit={this.handleSubmit}>
                    <p className="u-modal-title">
                        Edit Quest
                    </p>
                    <div className="u-modal-inp-wrap">
                        <textarea
                            className="u-modal-textarea"
                            placeholder="Test name"
                            name="question_content"
                            defaultValue={currentQuest.question_content}
                            required
                        />
                    </div>
                    <div className="u-modal-inp-wrap">
                        <select 
                            className="edit-quest-select"
                            name="weight"
                        >
                            <option value="1">1</option>
                            <option value="2" selected>2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
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