import React from "react"

import "styles/views/errors/default-error"
import { Link } from "react-router-dom"

export interface DefaultErrorProps {}

export interface DefaultErrorState {}

export default
class DefaultError
extends React.Component<DefaultErrorProps, DefaultErrorState> {
    render() {
        return <>
            <div className="v-default-error">
                <img src="/static/images/error.jpg" alt="img"/>
                <h3>Sorry, something went wrong</h3>
                {/* <p>
                    Back to
                    <Link to="/results">
                        homepage
                    </Link>
                </p> */}
            </div>
        </>
    }
}