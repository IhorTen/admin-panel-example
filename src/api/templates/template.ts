import { Template } from 'typings/Main'
import RequestWrap from "libs/requests/RequestWrap"

export const getTemplatesList = () => RequestWrap<Template[]>({
    endpoint: "templates/",
    method: "GET"
})

export const createNewTemplate = () => RequestWrap<Template>({
    endpoint: "templates/",
    method: "POST"
})

export const updateTemplate = (id: string) => RequestWrap<Template>({
    endpoint: `templates/${id}`,
    method: "PUT"
})