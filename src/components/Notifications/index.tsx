import React from "react"
import ReactDOM from "react-dom"
import NotificationsStore from "stores/Notifications"

import Item from "./Item"
import { observer } from "mobx-react"

export interface NotificationsProps {}

export interface NotificationsState {}

@observer
export default
class Notifications
extends React.Component<NotificationsProps, NotificationsState> {
    render() {
        return <>
            {/* {ReactDOM.createPortal(<Item {...this.props}/>, document.body)} */}
            {ReactDOM.createPortal(
                <div className={`notifications-wrap`}>
                    {NotificationsStore.notifications.map((item, i) => {
                        return (
                            <Item 
                                key={item.id}
                                item={item}
                            />
                        )
                    })} 
                </div>, 
                document.body
            )}
        </>
    }
}