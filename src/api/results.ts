import { ResultsData } from 'typings/Main'
import RequestWrap from "libs/requests/RequestWrap"

export const results = (type?: string) => RequestWrap<ResultsData>({
    endpoint: type ? `candidates/sources/${type}?limit=1000` : `candidates/?limit=2000`,
    method: "GET"
})