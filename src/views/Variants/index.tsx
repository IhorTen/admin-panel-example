import React from "react"
import { NavLink, Route } from "react-router-dom"
import { RouteComponentProps } from "react-router-dom"
import { observer } from "mobx-react"

import "styles/views/quest-page"

// Requests
import {variants} from "api/variants"

// Components / Views
import DeleteVariant from "../Variants/views/DeleteVariant"
import CreateVariant from "../Variants/views/CreateVariant"
import EditVariant from "views/Variants/views/EditVariant"
import VariantItem from "views/Variants/components/VariantItem"
import Spinner from "components/Preloaders/Spinner"
import Button from "components/Misc/Button"

// Stores
import VariantsStore from "stores/VariantsStore"

export interface VariantsPageProps extends RouteComponentProps<any> {}

export interface VariantsPageState {}

@observer
export default
class VariantsPage
extends React.Component<VariantsPageProps, VariantsPageState> {

    request = variants(this.props.match.params.id, this.props.match.params.questId)

    componentDidMount() {
        // Makes a request to the variants list
        this.request.run().then(res => {
            VariantsStore.setVariants(res)
            console.log("Variants:", res)
        }).catch(err => {
            console.log(err)
        })
        // window.setTimeout(() => {
        //     AnswersStore.setAnswers(MockupData.answers)
        // }, 1000)
    }

    componentWillUnmount() {
        this.request.abort()
        VariantsStore.clearCheckedRows()
    }

    selectAll = () => {
        let { variants, checkedRows } = VariantsStore
        variants.forEach(element => {
                let isIndex = checkedRows.includes(element.variant_id)
            if(!isIndex)
                checkedRows.push(element.variant_id)
        })
    }

    render() {
        let {id, questId} = this.props.match.params
        let {variants} = VariantsStore
        if(!variants) {
            return <Spinner />
        }
        return <>
            <div className="v-quest-page">
                <h1 className="quest-page-title">
                    {/* { currentQuest.questName } */}
                </h1>
                <div className="quest-page-wrap">
                    <div className="quest-page-head">
                        <div className="tests-head-left">
                            <input
                                type="text"
                                className="u-input"
                                placeholder="Search"
                            />
                        </div>
                        <div className="tests-head-right">
                            {VariantsStore.checkedRows.length !== 0 &&
                                <div className="tests-hide-btns">
                                    <div className="tests-hide-btns">
                                        <Button
                                            className="mainColor mr"
                                            onClick={() => { VariantsStore.clearCheckedRows() }}
                                        >
                                            <span>&#10008;</span>
                                            {VariantsStore.checkedRows.length}
                                        </Button>
                                        <NavLink
                                            to={`/quizzes/${id}/question-${questId}/answer-all/delete`}
                                        >
                                            <Button
                                                // text="Delete Selected"
                                                className="negativeColor mr"
                                            >
                                                Delete Selected
                                            </Button>
                                        </NavLink>
                                    </div>
                                </div>
                            }
                            <Button
                                className="mainColor mr"
                                onClick={this.selectAll}
                            >
                                Select All
                            </Button>
                            <NavLink
                                to={`/quizzes/${id}/question-${questId}/create`}
                            >
                                <Button
                                    // text="+"
                                    className="mainColor u-icon-btn"
                                >
                                    +
                                </Button>
                            </NavLink>
                        </div>
                    </div>
                    <div className="questions-list-wrap">
                        <ul className="questions-list">
                            {!variants
                            ? <Spinner/>
                            : variants.map((answer, i) => {
                                return (
                                    <VariantItem
                                        key={answer.variant_id}
                                        answerData={answer}
                                        styles={{
                                            animationDelay: `${100 * i}ms`
                                        }}
                                        {...this.props}
                                    />
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <Route
                path="/quizzes/:id/question-:questId/create"
                exact
                component={CreateVariant}
            />
            <Route 
                path="/quizzes/:id/question-:questId/answer-:variantId/edit"
                exact
                component={EditVariant}
            />
            <Route 
                path="/quizzes/:id/question-:questId/answer-:variantId/delete"
                exact
                component={DeleteVariant}
            />
        </>
    }
}