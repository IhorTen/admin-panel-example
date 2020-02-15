import { observable, action, computed, IObservableArray } from "mobx"
import { UserData } from "typings/Main"

class UsersStore {
    @observable
    usersList: UserData[]

    /**
     * Writes a list of users to the store
     * @param usersList List users
     */
    @action
    setUsers(usersList: UserData[]) {
        this.usersList = usersList
    }

    /**
     * Concat current users list with the new user instance
     * @param newUser User instance
     */
    @action
    addUser = (newUser: UserData) => {
        this.usersList.push(newUser)
    }

    /**
     * Searches for a mutable element by id in and replace with a changed one
     * @param data - Changed user data
     */
    @action
    editUser = (data: UserData) => {
        let user = this.usersList.find(user => {
            return user.id == data.id
        })
        let userIndex = this.usersList.indexOf(user)

        this.usersList.splice(userIndex, 1, data)
    }

    /**
     * Searches user by id
     * @param {string} id - User id
     * @returns User instance
     */
    @action
    getUserById = (userId: string): UserData | void => {
        return this.usersList.find(user => {
            return user.id == userId
        })
    }

    /**
     * Delete user
     * @param positionId - Id user
     */
    @action
    removeUser = (user: UserData) => {
        (this.usersList as IObservableArray<UserData>).remove(user)
    }
}

export default new UsersStore()