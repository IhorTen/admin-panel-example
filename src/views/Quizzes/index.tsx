import React from "react"
import { observer } from "mobx-react"
import { RouteComponentProps, Route } from "react-router-dom"
import { TestData, Quiz } from "typings/Main"

import "styles/views/quizzes"

//Components
import QuizItem from "views/Quizzes/components/QuizItem"
import Select from "components/Forms/Select/Default"
import Button from "components/Misc/Button"
import Spinner from "components/Preloaders/Spinner"
import Create from "views/Quizzes/views/Create"
import Delete from "views/Quizzes/views/Delete"
import Edit from "views/Quizzes/views/Edit"

// Stores
import QuizzesStore from "stores/QuizzesStore"

export interface QuizzesProps extends RouteComponentProps<any> {}

export interface QuizzesState {
    quizType: string
}

@observer
export default
class Quizzes
extends React.Component<QuizzesProps, QuizzesState> {

    state = {
        quizType: "All"
    }

    componentWillUnmount() {
        QuizzesStore.clearCheckedRows()
    }

    confirmDelete = (test: Quiz) => {
        // Delete quiz
        QuizzesStore.removeTest(test)
    }

    selectAll = () => {
        let { quizzes, checkedRows } = QuizzesStore
        quizzes.forEach(element => {
            let isIndex = checkedRows.find(el => {
                return el == element.id 
            })
            if(!isIndex) {
                checkedRows.push(element.id)
            }
        })
    }

    
    // Writes value input in state property quizType
    handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            quizType: event.currentTarget.value
        })
    }

    render() {
        let { quizzes, someChecked } = QuizzesStore
        let {quizType} = this.state
        return <>
            <div className="v-tests-list">
                <h1 className="manage-title">Quizzes Management</h1>
                <div className="tests-list-wrap">
                    <div className="tests-list-head">
                        <div className="tests-head-left">
                            <input
                                type="text"
                                className="u-input"
                                placeholder="Search"
                            />
                            <select 
                                className="quiz-manage-filter"
                                onChange={this.handleChange}
                            >
                                <option value="All">All</option>
                                <option value="Cognitive">Cognitive</option>
                                <option value="React">React</option>
                                <option value="Node">Node</option>
                            </select>
                        </div>
                        <div className="tests-head-right">
                            {someChecked &&
                                <div className="tests-hide-btns">
                                    <Button
                                        className="mainColor mr"
                                        onClick={() => { QuizzesStore.checkedRows = [] }}
                                    >
                                        <span>&#10008;</span>
                                        {QuizzesStore.checkedRows.length}
                                    </Button>
                                    <Button
                                        className="negativeColor mr"
                                        onClick={() => {
                                            this.props.history.push(`/tests/delete/all`) }
                                        }
                                    >
                                        Delete Selected
                                    </Button>
                                </div>
                            }
                            <Button
                                className="mainColor mr"
                                onClick={this.selectAll}
                            >
                                Select All
                            </Button>
                            <Button
                                className="mainColor u-icon-btn"
                                onClick={() => {
                                    this.props.history.push("/quizzes/create")
                                }}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                    <ul className="quiz-list">
                        {!quizzes
                            ? <Spinner />
                            : quizzes.filter(item => {
                                if(quizType == "All") {
                                    return true
                                } else {
                                    return item.type == quizType
                                }
                            }).map((el, i) => {
                                i++
                                return (
                                    <QuizItem
                                        key={el.id} 
                                        item={el}
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
            <Route
                path="/quizzes/create"
                exact
                component={Create}
            />
            <Route 
                path="/quizzes/edit/:id"
                exact
                component={Edit}
            />
            <Route 
                path="/quizzes/delete/:id"
                exact
                component={Delete}
            />
        </>
    }
}