import React from "react"
import ReactDOM from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

import "styles/components/modals/modal"

export interface ModalProps {
    className?: string,
    onClose?: () => void
}

export interface ModalState {
    stateModal: string
}

export default
class Modal
extends React.Component<ModalProps, ModalState> {

    static defaultProps = {
        className: ""
    }

    state = {
        stateModal: "show"
    }

    hideModal = () => {
        // Hide modal window
        this.setState({
            stateModal: "hide"
        })
    }

    onClose = (event: React.AnimationEvent<any>) => {
        // Make redirect on prev page
        if(event.animationName == "FadeOut") {
            this.props.onClose()
        }
    }

    render() {
        let { className } = this.props
        return <>
            {ReactDOM.createPortal(
                <div
                    onClick={this.hideModal}
                    className={`c-modal ${this.state.stateModal}`}
                    onAnimationEnd={event => this.onClose(event)}
                >
                    <div 
                        className={`modal-wrap ${className}`}
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault()
                            event.stopPropagation()
                            event.nativeEvent.stopImmediatePropagation()
                        }}
                    >
                        <div 
                            className="close-window"
                            onClick={this.hideModal}
                        >
                            <FontAwesomeIcon icon={faTimes}/>
                        </div>
                        {this.props.children}
                    </div>
                </div>,
                document.body
            )}
        </>
    }
}