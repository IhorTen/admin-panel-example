import RequestWrap from "libs/requests/RequestWrap"

export const quizTypes = () => RequestWrap({
    endpoint: "quizzes/types",
    method: "GET"
})