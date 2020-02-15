import { SendMessage, Message } from "typings/Main";
import MessageStore from "stores/MessageStore";
import Notifications from "stores/Notifications";
import { sendMessage } from "api/message/message";

/**
 * Send template to recipients
 * @param {SendMessage} data messageData
 * @param {string} route naming of route, can be "sms" or "mails"
 */
export const sendTemplate = (data: SendMessage, route: "sms" | "mails") => 
    sendMessage(route)
        .run(data)
        .then((res: Message[]) => {
            MessageStore.addMessage(res)
            Notifications.success(`${route} Sent`)
        })
        .catch(() => {
            Notifications.error("Error, please try later")
        })
