import React, { ErrorInfo } from "react"

import DefaultError from "views/Errors/DefaultError"

export interface ErrorHandlingProps {}

export interface ErrorHandlingState {
    hasError: boolean
}

export default
class ErrorHandling
extends React.Component<ErrorHandlingProps, ErrorHandlingState> {
    state = {
        hasError: false
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.log(error)
        return { hasError: true }
    }

    render() {
        if(this.state.hasError) {
            return (
                <div>
                    <DefaultError />
                </div>
            )
        }
        return this.props.children
    }
}