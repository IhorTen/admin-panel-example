import React from "react"
import { NavLink, RouteComponentProps, matchPath } from "react-router-dom"

import "styles/components/sidebar"
import Button from "./Misc/Button"
import AuthStore from "stores/AuthStore"
import ResultsStore from "stores/ResultsStore"

export interface SidebarProps extends RouteComponentProps<any> {
    isOpen?: boolean,
    onClose?: () => void
}

export interface SidebarState {}

export default
class Sidebar
extends React.Component<SidebarProps, SidebarState> {
    get isHidden(): boolean {
        return !!matchPath(this.props.location.pathname, { path: "/", exact: true })
    }
    render() {
        let { isOpen, onClose } = this.props
        if (this.isHidden)
            return null
        return <>
            <aside className={`sidebar ${
                    isOpen ? "show" : "hide"
                }`} >
                <div className="logo">
                    <img 
                        src="/static/images/logo.svg" 
                        alt="logo"
                    />
                </div>
                <ul 
                    className="sidebar-list"
                    onClick={onClose}
                >
                    <li>
                        <NavLink to="/results">
                            Results
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/quizzes">
                            {/* Quizzes management */}
                            Quizzes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/users">
                            {/* Users management */}
                            Users
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/positions">
                            {/* Positions management */}
                            Positions
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/mails">
                            Emails
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/sms">
                            SMS
                        </NavLink>
                    </li>
                </ul>
                <Button
                    className="mainColor ml"
                    onClick={AuthStore.logout}
                >
                    Log out
                </Button>
                <Button
                    className="mainColor refresh-sidebar"
                    onClick={ResultsStore.clearResults}
                >
                    <i className="fas fa-sync "/>
                    <span>Refresh</span>
                </Button>
            </aside>
        </>
    }
}