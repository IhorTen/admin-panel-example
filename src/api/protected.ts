import { User } from 'typings/Main'
import RequestWrap from "libs/requests/RequestWrap"

export const protectedReq = () => RequestWrap<User>({
    endpoint: "auth/protected",
    method: "GET"
})