import { API_PRODUCTION_HOST } from 'consts'
import AuthStore from 'stores/AuthStore'
import * as Superagent from "superagent"

export type Params = {
    url?: string,
    endpoint: string,
    method: "POST" | "GET" | "PUT" | "DELETE"
    headers?: any,
    data?: any
}

export interface AbortableRequest<T> {
	run: (data?: any) => Promise<T>,
	abort: () => void
}

function RequestWrap<T = any>(params: Params): AbortableRequest<T> {
    var { method, endpoint, headers = {} } = params
	var  url = API_PRODUCTION_HOST + endpoint

    const getRequest = (): Superagent.SuperAgentRequest => {
        switch(method) {
            case "POST":
                return Superagent.post(url)
            case "GET":
                return Superagent.get(url)
            case "PUT":
                return Superagent.put(url)
            case "DELETE":
                return Superagent.delete(url)
        }
    }

    var request = getRequest()

    return {
        run: (data?: any) => {
            return new Promise((resolve, reject) => {
                request
                    .set({
						...headers,
						Authorization: `Bearer ${AuthStore.access_token}`
					})
                    .on("abort", () => {
                        console.warn(`[Request Wrapper]: Request ${url} was aborted!`)
					})
					
                    ;(method == "GET"
                        ? request.query(data)
                        : request.send(data)
                    ).then((res) => {
                        resolve(res.body as T)
                    }).catch((error: Superagent.ResponseError) => {
                        console.error(error)
                        request = Superagent.post(`${API_PRODUCTION_HOST}auth/refresh`)
                        request
							.set({"Authorization": `Bearer ${AuthStore.refresh_token}`})
                            .then((res) => {
                                AuthStore.setAccessToken(res.body.access_token)
								request = getRequest()
                                request
                                    .set({
										...headers,
										Authorization: `Bearer ${AuthStore.access_token}`
									})
                                    .send(data)
                                    .then((res) => {
									
										resolve(res.body as T)
									})
                                    .catch(reject)
                            })
                            .catch((err) => {
                                reject()
                                AuthStore.logout()
                            })
                    })
            })
        },
        abort: () => request && request.abort()
    }
}

export default RequestWrap