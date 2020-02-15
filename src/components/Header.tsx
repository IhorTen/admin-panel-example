import React from "react"
import { RouteComponentProps, matchPath } from "react-router"

import "styles/components/header"

import Button from "./Misc/Button"
import AuthStore from "stores/AuthStore"
import Sidebar from "./Sidebar"

export interface HeaderProps extends RouteComponentProps<any> {
    className?: string,
    onClick?: () => void,
    isOpen: boolean
}

export interface HeaderState {
    
}

export default
class Header
extends React.Component<HeaderProps, HeaderState> {
    
    static defaultProps = {
        className: ""
    }
    
    get isHidden(): boolean {
        return !!matchPath(this.props.location.pathname, { path: "/", exact: true })
    }

    render() {
        let { onClick, isOpen } = this.props
        if (this.isHidden)
            return null

        return <>
            <button 
                className={`head-menu ${
                    isOpen ? "show" : "hide"
                }`}
                onClick={onClick}
            >
                <div/>
                <div/>
                <div/>
            </button>
            <header className={`main-head ${this.props.className}`}>
                <div className="head-logo">
                    <img 
                        src="/static/images/logo.svg" 
                        alt="logo"
                    />
                </div>
            </header>
        </>
    }
}