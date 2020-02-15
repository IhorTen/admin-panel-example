import React from "react"
import { Route, Switch } from "react-router-dom"
import { observer } from "mobx-react"

import "styles/views/Messages/messageList"

import TemplateSmS from "./views/TemplateSms"
import SendSms from "./views/SendSms"
import MessageStore from "stores/MessageStore"
import Spinner from "components/Preloaders/Spinner"
import {getTemplatesList} from "api/templates/template"
import MessageList from "components/MessageList/MessageList"
import { getMessageList } from "api/message/message"

export interface SmsProps {}

export interface SmsState {}

@observer
export default
class Sms
extends React.Component<SmsProps, SmsState> {

    componentDidMount() {
        Promise.all([
            getMessageList("sms").run(),
            getTemplatesList().run()
        ]).then(([smsList, templatesList]) => {
            MessageStore.setData(smsList, templatesList)
        }).catch( err => {
            console.log("Promise All", err)
        })
    }

    componentWillUnmount() {
        MessageStore.cleanMessageList()
    }

    render() {
        return !MessageStore.ready
            ? <>
                <main className="v-message-page">
                    <Spinner/>
                </main>
            </>
            : <>
                <main className="v-message-page">
                    <Switch>
                        <Route 
                            path="/sms"
                            exact
                            render={props => <MessageList {...props} type="sms"/> }
                        />
                        <Route
                            path="/sms/template"
                            exact
                            component={TemplateSmS}
                        />
                        <Route
                            path="/sms/template/:id"
                            component={SendSms}
                        />
                    </Switch>
                </main>
            </>
    }
}