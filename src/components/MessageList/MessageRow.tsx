import React from "react"

import "styles/components/results/result-item"

import { Message } from "typings/Main"
import Button from "../Misc/Button"
import Modal from "../Modals/Default"

export interface MessageRowProps {
    item?: Message,
    onClose?: () => void
}

export interface MessageRowState {
    openModal: boolean
}

export default
class MessageRow
extends React.Component<MessageRowProps, MessageRowState> {
    state = {
        openModal: false
    }

    /**
     * Change state property openModal on true
     */
    handleClick = () => {
        this.setState({
            openModal: true
        })
    }

    /**
     * Redirect and hide modal
     */
    handleClose = () => {
        this.props.onClose()
        this.setState({
            openModal: false
        })
    }

    render() {
        const {openModal} = this.state
        let {item} = this.props
        return <>
            <div className="result-item msg">
                <div className="result-item-flex msg">
                    <div className="w10">
                        {item.index}
                    </div>
                    <div className="w20">
                        {item.date._formatDate("full")}
                    </div>
                    <div className="w30">
                        {item.sender}
                    </div>
                    <div className="w30">
                        {item.recipient}
                    </div>
                    <div className="w10">
                        <Button
                            className="mainColor view-content-btn"
                            onClick={this.handleClick}
                        >
                            View
                        </Button>
                    </div>
                </div>
                {openModal
                    ? <Modal
                        onClose={this.handleClose}
                        className="msg-modal"
                    >
                        <div className="msg-modal-content">
                            <div 
                                className="msg-modal-title"
                                dangerouslySetInnerHTML={{
                                    __html: item.subject
                                }}
                            />
                            <div 
                                className="modal-content"
                                dangerouslySetInnerHTML={{
                                    __html: item.content
                                }}
                            />
                            <Button
                                className="mainColor msg-modal-btn"
                                onClick={this.handleClose}
                            >
                                Ok
                            </Button>
                        </div>
                    </Modal>
                    : null
                }
            </div>
        </>
    }
}