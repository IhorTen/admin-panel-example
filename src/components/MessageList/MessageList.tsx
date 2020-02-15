import React from "react"
import { RouteComponentProps } from "react-router"
import { Link } from "react-router-dom"
import Button from "components/Misc/Button"
import Spinner from "components/Preloaders/Spinner"
import MessageRow from "components/MessageList/MessageRow"
import MessageStore from "stores/MessageStore"
import { Message } from "typings/Main"
import { observer } from "mobx-react"


export interface MessageListProps extends RouteComponentProps<any> {
    inputSearchName?: string,
    inputSearchPlaceholder?: string,
    routeName?: string,
    closeEndpoint?: string,
    type?: "sms" | "mails"
    showDate?: (item: Message) => string
}

export interface MessageListState {}

@observer
export default
class MessageList
extends React.Component<MessageListProps, MessageListState> {

    get params() {
        return this.props.type == "sms"
            ? {
                placeholder: "Type number to search...",
                route: "sms"
            }
            : {
                placeholder: "Type email to search...",
                route: "mails",

            }
    }

    /**
     * Extract value and name from event, set filters values depending on the event name, setState date filters
     * @param {React.FormEvent<HTMLInputElement>} event my cool event
     */
    handleSearch = (event: React.FormEvent<HTMLInputElement>) => {   
        let {value, valueAsDate, name} = event.currentTarget
        switch (name) {
            case "query":
                MessageStore.setFilterQuery(value)
                break
            case "from":
                MessageStore.setFilterFrom(value)
                break
            case "to":
                MessageStore.setFilterTo(value)
                break
        }
    }

    onCloseModal = () => {
        this.props.history.push(`/${this.params.route}`)
    }

    render() {
        const { messageList, filters } = MessageStore
        let { placeholder, route } = this.params
        
        return <>
            <div className="v-message-list-page">
                <div className="message-list-head">
                    <div className="message-list-head-left">
                        <div className="list-search-wrap">
                            <img src="/static/images/ic_search.svg" alt="search"/>
                            <input 
                                type="text"
                                name="query"
                                className="input_search"
                                ref="search"
                                placeholder={placeholder}
                                onChange={this.handleSearch}
                            />
                        </div>
                        <div className="list-search-wrap date-picker">
                            <div className="date-picker-from">
                                <span> From: </span>
                                <input
                                    className="date-from"
                                    type="datetime-local"
                                    name="from"
                                    onChange={this.handleSearch}
                                    max={filters.dateTo ? filters.dateTo : ""}
                                />
                            </div>
                            <div className="date-picker-to">
                                <span> To: </span>
                                <input 
                                    className="date-to"
                                    type="datetime-local"
                                    name="to"
                                    onChange={this.handleSearch}
                                    min={filters.dateFrom ? filters.dateFrom : ""}
                                />
                            </div>
                        </div>
                    </div>
                    <Link to={`/${route}/template/`}>
                        <Button className="mainColor btn-create" >
                            Create
                        </Button>
                    </Link>
                </div>
                <div className="message-list-table">
                    <div className="msg-table-head msg">
                        <p className="msg-table-title w10">
                            Number
                        </p>
                        <p className="msg-table-title w20">
                            Date
                        </p>
                        <p className="msg-table-title w30">
                            Sender
                        </p>
                        <p className="msg-table-title w30">
                            Recipient
                        </p>
                        <p className="msg-table-title w10">
                            Content
                        </p>
                    </div>
                    <div className="msg-table-body">
                        {!messageList
                            ? <Spinner />
                            : MessageStore.filtered.map((item, i) => {
                                return (
                                    <MessageRow
                                        key={i}
                                        item={{...item, index: i+1}}
                                        onClose={this.onCloseModal}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div> 
        </>
    }
}