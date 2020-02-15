import { observable, action, computed, toJS } from "mobx"

export type NotificationState = "visible" | "hide"
export type NotificationType = "success" | "error" | "info"

export type Notification = {
    id?: number,
    text: string,
    state?: NotificationState,
    type: NotificationType
}

const MAX_VISIBLE = 3

class NotificationStore {
    private counter: number = 0

    @observable notifications: Notification[] = []

    /**
     * Add new notification
     * @param  newNotificztion - Instance new notification 
     */
    @action
    private push = (newNotification: Notification) => {
        if(!newNotification.state)
            newNotification.state = "visible"

        newNotification.id = this.counter //++
        this.counter += 1

        if(this.notifications.length >= MAX_VISIBLE)
            this.notifications.shift()
        this.notifications.push(newNotification)
    }

    /**
     * Hide notification
     * @param {number} id - Id notification to hide
     */
    @action
    hide = (id: number) => {
        let notification = this.notifications.find(el => {
            return el.id == id
        })
        notification.state = "hide"
    }

    
    // Clear notifications list
    @action
    clear = () => {
        this.notifications = []
    }
    // --------------- //
    /**
     * Create notification info type
     * @param {string} text - Text notification
     */
    info = (text: string) => {
        this.push({
            text,
            type: "info"
        })
    }

    /**
     * Create notification success type
     * @param {string} text - Text notification
     */
    success = (text: string) => {
        this.push({
            text,
            type: "success"
        })
    }

    /**
     * Create notification error type
     * @param {string} text - Text notification
     */
    error = (text: string) => {
        this.push({
            text,
            type: "error"
        })
    }
}

export default new NotificationStore()