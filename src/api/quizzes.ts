import { Quiz } from 'typings/Main'
import RequestWrap from "libs/requests/RequestWrap"

export const quizzes = () => RequestWrap<Quiz[]>({
    endpoint: "quizzes/",
    method: "GET"
})

export const createQuiz = () => RequestWrap({
    endpoint: "quizzes/",
    method: "POST"
})

export const deleteQuiz = (id:string) => RequestWrap({
    endpoint: `quizzes/${id}`,
    method: "DELETE"
})

export const editQuiz = (id: string) => RequestWrap({
    endpoint: `quizzes/${id}`,
    method: "PUT"
})