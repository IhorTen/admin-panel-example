import { Variant } from 'typings/Main'
import RequestWrap from "libs/requests/RequestWrap"

export const variants = (id: string, questId: string) => RequestWrap<Variant[]>({
    endpoint: `quizzes/${id}/questions/${questId}/variants`,
    method: "GET"
})

export const createVariant = (id: string, questId: string) => RequestWrap({
    endpoint: `quizzes/${id}/questions/${questId}/variants`,
    method: "POST"
})

export const deleteVariant = (id: string, questId: string, answerId: string) => RequestWrap({
    endpoint: `quizzes/${id}/questions/${questId}/variants/${answerId}`,
    method: "DELETE"
})

export const editVariant = (id: string, questId: string, variantId: string) => RequestWrap({
    endpoint: `quizzes/${id}/questions/${questId}/variants/${variantId}`,
    method: "PUT"
})