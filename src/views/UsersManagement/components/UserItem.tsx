import React from "react"
import { UserData } from "typings/Main"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt, faPencilAlt } from "@fortawesome/free-solid-svg-icons"

import "styles/components/users/user-item"

export interface UserItemProps {
    index: number,
    userItem: UserData,
    styles?: React.CSSProperties
}

export interface UserItemState {
    
}

export default
class UserItem
extends React.Component<UserItemProps, UserItemState> {

    static defaultProps = {
        styles: {}
    }

    render() {
        let { userItem, index } = this.props
        return <>
            <div 
                className="user-item"
                style={this.props.styles}
            >
                <div className="user-item-actions">
                    <Link
                        className="user-edit"
                        to={`/users/${userItem.id}/edit`}
                    >
                        <FontAwesomeIcon icon={faPencilAlt} />
                    </Link>
                    <Link 
                        className="user-delete"
                        to={`/users/${userItem.id}/delete`}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                        {/* &#10008; */}
                    </Link>
                </div>
                <div className="user-img-wrap">
                    <img src="/static/images/user.jpg" alt="user"/>
                </div>
                <div>
                    <span className="user-item-email">
                        { userItem.email }
                    </span>
                </div>
            </div>
        </>
    }
}