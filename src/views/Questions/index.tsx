import React from "react"
import { RouteComponentProps, NavLink, Route, Link } from "react-router-dom"
import { observer } from "mobx-react"
import { toJS } from "mobx"
import { CreateQuiz } from "typings/Main"

import "styles/views/test-page"

// Requests
// import { quizzes } from "api/quizzes"
import { questions } from "api/questions"
import { editQuiz, quizzes } from "api/quizzes"

// Components / Views
import QuizzesStore from "stores/QuizzesStore"
import QuestsStore from "stores/QuestsStore"
import QuestItem from "views/Questions/components/QuestItem"
import Button from "components/Misc/Button"
import Spinner from "components/Preloaders/Spinner"
import WYSIWYG from "components/Misc/WYSIWYG"
import FormWrap from "components/Forms/FormWrap"

// Modals
import CreateQuest from "../Questions/views/CreateQuest"
import DeleteQuest from "../Questions/views/DeleteQuest"
import EditQuest from "views/Questions/views/EditQuest"

// Stores
import Notifications from "stores/Notifications"

export interface QuestionsPageProps extends RouteComponentProps<any> {}

export interface QuestionsPageState {}

@observer
export default
class QuestionsPage
extends React.Component<QuestionsPageProps, QuestionsPageState> {

    request = questions(this.props.match.params.id)
    editQuiz = editQuiz(this.props.match.params.id)

    componentDidMount() {
        // Makes a request to the questions list
        this.request.run().then(res => {
            QuestsStore.setQuestList(res)
        }).catch(err => {
            console.log(err)
        })
    }

    componentWillUnmount() {
        // Abort requests on questions list and quiz edit
        this.request.abort()
        this.editQuiz.abort()
        QuestsStore.clearCheckedRows()
    }

    // Selected all questions
    selectAll = () => {
        let { questList } = QuestsStore 
        
        questList.forEach((quest) => {
            let isIndex = QuestsStore.checkedRows.find(el => {
                return el == quest.question_id
            })
            if (!isIndex) {
                QuestsStore.checkedRows.push(quest.question_id)
            }
        })
    }

    /**
     * Makes request on edit current quiz
     * @param data - changed data
     */
    handleSubmit = (data: CreateQuiz) => {
        delete data.font_size
        this.editQuiz.run(data).then(res => {
            quizzes().run().then(res => {
                QuizzesStore.setTestList(res)
            }).catch(err => {
                console.log(err)
            })
            Notifications.success("Quiz changed successfully")
        }).catch(err => {
            Notifications.error(err.message)
        })
    }

    render() {
        let { id } = this.props.match.params
        let { questList } = QuestsStore
        
        if(QuizzesStore.quizzes) {
            var currentQuiz = QuizzesStore.getTestById(id)
        }
        if(!QuestsStore.questList || !currentQuiz)
            return <Spinner />

        return <>
            <div className="v-test-page">
                {/* <h1 className="test-page-item">
                    {questList.name}
                </h1>
                <p className="test-page-descr">
                    {questList.description}
                </p> */}
                <FormWrap
                    className="questions-page-form"
                    onSubmit={this.handleSubmit}
                >
                    <input 
                        type="text" 
                        name="name"
                        className="quiz-name-input"
                        defaultValue={currentQuiz.name}
                    />
                    <WYSIWYG 
                        // inpName={currentQuiz.name}
                        defaultValue={currentQuiz.description}
                        addFile={true}
                    />
                    <Button
                        className="mainColor mt"
                        type="submit"
                    >
                        Edit
                    </Button>
                </FormWrap>
                <div className="test-page-wrap">
                    <div className="test-page-head">
                        <div className="tests-head-left">
                            <input
                                type="text"
                                className="u-input"
                                placeholder="Search"
                            />
                        </div>
                        <div className="tests-head-right">
                            {QuestsStore.checkedRows.length !== 0 &&
                                <div className="tests-hide-btns">
                                    <div className="tests-hide-btns">
                                        <Button
                                            className="mainColor mr"
                                            onClick={() => { QuestsStore.clearCheckedRows() }}
                                        >
                                            <span>&#10008;</span>
                                            {QuestsStore.checkedRows.length}
                                        </Button>
                                        <Link to={`/quizzes/${this.props.match.params.id}/delete/all`}>
                                            <Button className="negativeColor mr">
                                                Delete Selected
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            }
                            <Button
                                className="mainColor mr"
                                onClick={this.selectAll}
                            >
                                Select All
                            </Button>
                            <Link to={`/quizzes/${id}/create`}>
                                <Button className="mainColor u-icon-btn">
                                    +
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="questions-list-wrap">
                        <ul className="questions-list">
                            {!questList
                                ? <Spinner />
                                : questList.map((quest, i) => {
                                    i++
                                    return (
                                        <QuestItem
                                            key={quest.question_id}
                                            dataQuest={quest}
                                            styles={{
                                                animationDelay: `${100 * i}ms`
                                            }}
                                            {...this.props}
                                        />
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <Route
                path="/quizzes/:id/create"
                exact
                component={CreateQuest}
            />
            <Route 
                path="/quizzes/:id/edit/:questId"
                exact
                component={EditQuest}
            />
            <Route 
                path="/quizzes/:id/delete/:questId"
                exact
                component={DeleteQuest}
            />
        </>
    }
}