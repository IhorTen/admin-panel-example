import React from "react"
import { observer } from "mobx-react"
import { RouteComponentProps, Switch, Route } from "react-router-dom"

import "styles/views/tests"

//Requests
import { quizzes } from "api/quizzes"

//Components/Views
import Quizzes from "views/Quizzes"
import QuestionPage from "views/Questions"
import VariantsPage from "views/Variants"

//Stores
import QuizzesStore from "stores/QuizzesStore"

export interface TestsManageProps extends RouteComponentProps<any> {}

export interface TestsManageState {}

@observer
export default
class TestsManage
extends React.Component<TestsManageProps, TestsManageState> {

    request = quizzes()

    componentDidMount() {
        // Makes a request to the quizzes list
        this.request.run().then(res => {
            QuizzesStore.setTestList(res)
        }).catch(err => {
            console.log(err)
        })
    }

    componentWillUnmount() {
        // Aborting request to the quizzes list
        this.request.abort()
    }

    render() {
        return <>
            <main className="v-tests-manage">
                <div className="a-panel-content">
                    <Switch>
                        <Route
                            path="/quizzes/:id/question-:questId"
                            component={VariantsPage}
                        />
                        <Route
                            path={[
                                // "/tests",
                                "/quizzes/create",
                                "/quizzes/(edit|delete)/:id"
                            ]}
                            exact
                            component={Quizzes}
                        />
                        <Route
                            path="/quizzes/:id"
                            component={QuestionPage}
                        />
                        <Route component={Quizzes} />
                    </Switch>
                </div>
            </main>
        </>
    }
}