import React from "react"
import { Route, Switch, RouteComponentProps } from "react-router-dom"
import { observer } from "mobx-react"

import "styles/views/Messages/messageList"

import TemplateMail from "./views/TemplateMail"
import SendEmail from "./views/SendEmail"
import MessageStore from "stores/MessageStore"
import Spinner from "components/Preloaders/Spinner"
import {getTemplatesList} from "api/templates/template"
import MessageList from "components/MessageList/MessageList"
import { getMessageList } from "api/message/message"
import Notifications from "stores/Notifications"

export interface MailsProps extends RouteComponentProps<any>{}

export interface MailsState {}

@observer
export default
class Mails
extends React.Component<MailsProps, MailsState> {

    componentDidMount() {
        Promise.all([
            getMessageList("mails").run(),
            getTemplatesList().run()
        ]).then(([mailsList, templatesList]) => {
            MessageStore.setData(mailsList, templatesList)
        }).catch( () => {
            Notifications.error(`Error`)
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
                            path="/mails"
                            exact
                            render={props => <MessageList {...props} type="mails"/> }
                        />
                        <Route
                            path="/mails/template"
                            exact
                            component={TemplateMail}
                        />
                        <Route
                            path="/mails/template/:id"
                            component={SendEmail}
                        />
                    </Switch>
                </main>
            </>
    }
}