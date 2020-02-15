import { Quest } from 'typings/Main';
import RequestWrap from "libs/requests/RequestWrap"

export const questions = (id: string) => RequestWrap<Quest[]>({
    endpoint: `quizzes/${id}/questions`,
    method: "GET"
})

export const createQuest = (id: string) => RequestWrap({
    endpoint: `quizzes/${id}/questions`,
    method: "POST"
})

export const deleteQuest = (id: string, questId: string) => RequestWrap({
    endpoint: `quizzes/${id}/questions/${questId}`,
    method: "DELETE"
})

export const editQuestion = (id: string, questId: string) => RequestWrap({
    endpoint: `quizzes/${id}/questions/${questId}`,
    method: "PUT"
})