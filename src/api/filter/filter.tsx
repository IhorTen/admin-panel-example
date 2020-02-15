import RequestWrap from "libs/requests/RequestWrap"
import { ResultsData } from "typings/Main"

export const filter = () => RequestWrap<ResultsData>({
    endpoint: `candidates/`,
    method: "GET"
})
