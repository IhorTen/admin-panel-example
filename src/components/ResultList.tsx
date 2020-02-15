import React from "react"
import { RouteComponentProps } from "react-router-dom"
import { Message } from "../typings/Main"

import "styles/components/results/result-item"

import Button from "./Misc/Button"
import Modal from "./Modals/Default"

export interface ResultListProps extends RouteComponentProps<any> {
    item?: Message,
    number?: number,
    showTime?: (item: Message) => {},
    closeEndpoint: string
}

export interface ResultListState {
    openModal: boolean
}

export default
class ResultList
extends React.Component<ResultListProps, ResultListState> {
    state = {
        openModal: false
    }

    handleClick = () => {
        // Change state property openModal on true
        this.setState({
            openModal: true
        })
    }

    
    // Redirect and hide modal
    handleClose = () => {
        this.props.history.push(`/${this.props.closeEndpoint}`)
        this.setState({
            openModal: false
        })
    }

    render() {
        const {openModal} = this.state
        let {item, number} = this.props
        return <>
            <div className="result-item">
                <div className="result-item-flex">
                    <div className="w10">
                        {number}
                    </div>
                    <div className="w20">
                        {this.props.showTime(item)}
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