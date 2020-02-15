import { Message } from 'typings/Main'
import RequestWrap from "libs/requests/RequestWrap"

export const getMailsList = () => RequestWrap<Message[]>({
    endpoint: "mails/",
    method: "GET"
})

export const sendMails = () => RequestWrap<Message[]>({
    endpoint: "mails/mailing",
    method: "POST"
})

export const importCsvEmails = () => RequestWrap<string[]>({
    endpoint: "mails/csv",
    method: "POST"
})
