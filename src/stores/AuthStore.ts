import { LS_ACCESS_TOKEN, LS_REFRESH_TOKEN } from "consts/index"
import { observable, action, computed, autorun } from "mobx"
import { User } from "typings/Main"

class UserStore {
    @observable access_token: string
    @observable refresh_token: string
    @observable user: User
    @observable isChecked: boolean = false
    @observable isAuthError: boolean

    // True if has user data
    @computed
    get isLogged() {
        return !!this.user
    }

    constructor() {
        if(typeof localStorage != "undefined") {
            this.access_token = localStorage.getItem("auth_token")
            this.refresh_token = localStorage.getItem("refresh_token")
        }
        // this.saveTokens = autorun(this.saveTokens)
    }

    /**
     * Set user data in variable user and change flag isChecked on true
     * @param user - User data 
     */
    @action
    login = (user?: User) => {
        this.user = user
        this.isChecked = true
    }

    //Clear user variable, change flag isChecked on true and clear localstorage
    @action
    logout = () => {
        this.isChecked = true
        this.user = undefined
        
        this.removeTokens()
    }

    // Deleted access and refresh tokens from localstorage
    @action
    removeTokens = () => {
        // this.access_token = ""
        // this.refresh_token = ""

        // not necessary
        localStorage.removeItem(LS_ACCESS_TOKEN)
        localStorage.removeItem(LS_REFRESH_TOKEN)
    }

    /**
     * Set tokens in store variable and localstorage
     * @param {string} access_token
     * @param {string} refresh_token
     */
    @action
    setTokens = (access_token: string, refresh_token: string) => {
        this.access_token = access_token
        this.refresh_token = refresh_token

        if(typeof localStorage != "undefined") {
            localStorage.setItem(LS_ACCESS_TOKEN, this.access_token)
            localStorage.setItem(LS_REFRESH_TOKEN, this.refresh_token)
        }
    }

    /**
     * Set access_token in store veriable and localstorage
     * @param {string} access_token
     */
    @action
    setAccessToken = (access_token: string) => {
        this.access_token = access_token
        if(typeof localStorage != "undefined")
            localStorage.setItem(LS_ACCESS_TOKEN, this.access_token)
    }

    
    // Autorun function - set access and refresh tokens into localstorage
    saveTokens = () => {
        if(typeof localStorage != "undefined") {
            localStorage.setItem(LS_ACCESS_TOKEN, this.access_token)
            localStorage.setItem(LS_REFRESH_TOKEN, this.refresh_token)
        }
    }
}

export default new UserStore()