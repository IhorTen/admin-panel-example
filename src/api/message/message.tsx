import { Message } from 'typings/Main'
import RequestWrap from "libs/requests/RequestWrap"

export const getMessageList = (route: "sms" | "mails") => RequestWrap<Message[]>({
    endpoint: `${route}/`,
    method: "GET"
})

export const sendMessage = (route: "sms" | "mails") => RequestWrap<Message[]>({
    endpoint: `${route}/mailing`,
    method: "POST"
})

export const importCsv = (route: "sms" | "mails") => RequestWrap<string[]>({
    endpoint: `${route}/csv`,
    method: "POST"
})