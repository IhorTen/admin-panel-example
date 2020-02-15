import RequestWrap from "libs/requests/RequestWrap"
import { UserData } from "typings/Main"

export const users = RequestWrap<UserData[]>({
    endpoint: "users/",
    method: "GET"
})

export const createUser = () => RequestWrap({
    endpoint: "users/",
    method: "POST"
})

export const deleteUser = (id: string) => RequestWrap({
    endpoint: `users/${id}`,
    method: "DELETE"
})

export const editUser = (userId: string) => RequestWrap({
    endpoint: `users/${userId}`,
    method: "PUT"
})