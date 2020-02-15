import React from "react"
import { Link } from "react-router-dom"

import "styles/components/users/users-head"

// Components / Views
import Button from "components/Misc/Button"

export interface UsersHeadProps {}

export interface UsersHeadState {}

export default
class UsersHead
extends React.Component<UsersHeadProps, UsersHeadState> {
    render() {
        return <>
            <div className="users-head">
                <input 
                    type="text"
                    placeholder="Type user name"
                    className="users-head-search"
                />
                <div className="users-head-right">
                    <Link to="/users/create">
                        <Button className="mainColor mr">
                            Create user
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    }
}