import { Message } from 'typings/Main'
import RequestWrap from "libs/requests/RequestWrap"

export const getSmsList = () => RequestWrap<Message[]>({
    endpoint: "sms/",
    method: "GET"
})

export const sendSms = () => RequestWrap<Message[]>({
    endpoint: "sms/mailing",
    method: "POST"
})

export const importCsvSms = () => RequestWrap<string[]>({
    endpoint: "sms/csv",
    method: "POST"
})