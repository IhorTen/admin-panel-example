import React from "react"

import "styles/components/misc/button"

export interface ButtonProps {
    // text?: string, // React.ReactNode
    className?: string,
    id?: string
    name?: string,
    link?: string,
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
    disabled?: boolean
}

export interface ButtonState {}

export default
class Button
extends React.Component<ButtonProps, ButtonState> {
    static defaultProps = {
        className: "",
        name: "",
        type: "button"
    }

    render() {
        let {className, onClick, disabled, name, type, id} = this.props
        return <>
            <button
                type={type}
                className={`u-button ${className}`}
                id={id}
                name={name}
                onClick={onClick}
                disabled={disabled}
            >
                {this.props.children}
            </button>
        </>
    }
}