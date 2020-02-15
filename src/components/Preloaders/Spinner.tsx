import React from "react"

import "styles/components/preloader/default-preloader"

export interface SpinnerProps {
    
}

export interface SpinnerState {
    
}

export default
class Spinner
extends React.Component<SpinnerProps, SpinnerState> {
    render() {
        return <>
            <div className="spinner" />
        </>
    }
}