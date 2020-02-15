import React from "react"
import { Route } from "react-router"
import { observer } from "mobx-react"
import { UserData } from "typings/Main"

import "styles/views/users-management"

// Requests 
import { users } from "api/users"

// Components / Views
import CreateUser from "./views/CreateUser"
import UsersHead from "views/UsersManagement/components/UsersHead"
import UserItem from "views/UsersManagement/components/UserItem"
import Spinner from "components/Preloaders/Spinner"
import DeleteUser from "./views/DeleteUser"
import EditUser from "./views/EditUser"

// Stores
import UsersStore from "stores/UsersStore"

export interface UsersManagementProps {}

export interface UsersManagementState {}


@observer
export default
class UsersManagement
extends React.Component<UsersManagementProps, UsersManagementState> {

    componentDidMount() {
        // Makes a request to the users list
        users.run().then(res => {
            UsersStore.setUsers(res)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        let { usersList } = UsersStore
        return <>
            <div className="v-users-management">
                <div className="a-panel-content">
                    <UsersHead />
                    <div className="users-list">
                        {!usersList
                            ? <Spinner />
                            :usersList.map((user, i) => {
                                i++
                                return (
                                    <UserItem
                                        key={user.id}
                                        index={i}
                                        userItem={user}
                                        styles={{
                                            animationDelay: `${100 * i}ms`
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                    <Route 
                        path="/users/create"
                        component={CreateUser}
                    />
                    <Route 
                        path="/users/:userId/edit"
                        component={EditUser}
                    />
                    <Route 
                        path="/users/:userId/delete"
                        component={DeleteUser}
                    />
                </div>
            </div>
        </>
    }
}