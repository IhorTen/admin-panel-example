import React from "react"
import { DataPosition } from "typings/Main"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt, faPencilAlt, faEllipsisV } from "@fortawesome/free-solid-svg-icons"

import "styles/components/positions/position-item"

export interface PositionItemProps {
    positionItem: DataPosition,
    className?: any,
    styles?: React.CSSProperties
}

export interface PositionItemState {
    isActionList: boolean 
}

export default
class PositionItem
extends React.Component<PositionItemProps, PositionItemState> {
    static defaultProps = {
        className: "",
        styles: {}
    }

    state = {
        isActionList: false
    }

    componentDidMount() {
        document.addEventListener("click", this.hideActionList)
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.hideActionList)
    }

    showActionList = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
        this.setState({
            isActionList: !this.state.isActionList
        })
    }

    hideActionList = () => {
        this.setState({
            isActionList: false
        })
    }

    render() {
        let { positionItem } = this.props
        return <>
            <div 
                className={`position-item ${this.props.className}`}
                style={this.props.styles}
            >
                {/* <div className="position-image-wrap">
                    <img 
                        src={positionItem.image} 
                        alt="position-image"
                    />
                </div> */}
                <p className="position-item-name">
                    {positionItem.name}
                </p>
                <div className="position-item-actions">
                    {/* <Link to={`/positions/${positionItem.id}/edit`}>
                        <div>
                            <img 
                                src="/static/images/edit.svg" 
                                alt="pen"
                                onClick={this.showActionList}
                            />
                        </div>
                    </Link>
                    <Link
                        className="position-delete"
                        to={`/positions/${positionItem.id}/delete`}
                    >
                        &#10008;
                    </Link> */}
                    {/* {this.state.isActionList && */}
                        <div className={`action-list ${this.state.isActionList ? "fade-in" : "fade-out"}`}>
                            <Link 
                                className="action-list-item negativeBg delete"
                                to={`/positions/${positionItem.id}/delete`}
                            >
                                <FontAwesomeIcon icon={faTrashAlt}/>
                            </Link>
                            <Link 
                                className="action-list-item colorMainBg edit"
                                to={`/positions/${positionItem.id}/edit`}
                            >
                                <FontAwesomeIcon icon={faPencilAlt}/>
                                {/* &#9998; */}
                            </Link>
                        </div>
                    {/* } */}
                    {/* <img 
                        src="/static/images/edit.svg" 
                        alt="pen"
                        onClick={this.showActionList}
                    /> */}
                    <div onClick={this.showActionList}>
                        <FontAwesomeIcon icon={faEllipsisV}/>
                    </div>
                </div>
            </div>
        </>
    }
}