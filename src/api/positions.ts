import { DataPosition } from 'typings/Main'
import RequestWrap from 'libs/requests/RequestWrap'

export const positions = () => RequestWrap<DataPosition[]>({
    endpoint: "positions/",
    method: "GET"
})

export const createPositions = () => RequestWrap({
    endpoint: "positions/",
    method: "POST"
})

export const deletePostion = (id: string) => RequestWrap({
    endpoint: `positions/${id}`,
    method: "DELETE"
})

export const editPosition = (positionId: string) => RequestWrap({
    endpoint: `positions/${positionId}`,
    method: "PUT"
})