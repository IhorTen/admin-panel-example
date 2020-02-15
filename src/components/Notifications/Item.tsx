import React from "react"
import NotificationsStore, { Notification } from "stores/Notifications"

import "styles/components/notifications"
import { observer } from "mobx-react"
import { toJS } from "mobx"

export interface NotificationItemProps {
    item: Notification
}

export interface NotificationItemState {}

@observer
export default
class NotificationItem
extends React.Component<NotificationItemProps, NotificationItemState> {
    timeout: number

    static defaultProps = {
        className: ""
    }
    
    componentDidMount() {
        this.setTimeout()
    }

    componentWillUnmount() {
        this.clearTimeout()
    }

    setTimeout = () => {
        this.timeout = window.setTimeout(() => {
            NotificationsStore.hide(this.props.item.id)
        }, 1500)
    }

    clearTimeout = () => {
        clearTimeout(this.timeout)
        this.timeout = undefined // NN
    }

    handleMouseEnter = () => {
        this.clearTimeout()
    }

    handleMouseLeave = () => {
        this.setTimeout()
    }

    get getStatusImage() {
        switch(this.props.item.type) {
            case "success":
                return "tick.svg"
            case "error":
                return "error.svg"
            case "info":
                return "info.svg"
        }
    }

    render() {
        let { item } = this.props
        return <>
            <div
                className={`notifications-item ${item.type} ${item.state}`}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <p className="content">
                    {item.text}
                </p>
                <div className="image">
                    <img src={`/static/images/${this.getStatusImage}`} alt="notification-img"/>
                </div>
            </div>
        </>
    }
}