import React from "react"
import { observer } from "mobx-react"
import { NavLink, Link, RouteComponentProps } from "react-router-dom"
import { Quiz } from "typings/Main"

import "styles/components/quiz-item"

// Components / Views
import Button from "components/Misc/Button"
import Checkbox from "components/Forms/Inputs/Checkbox"

// Stores
import QuizzesStore from "stores/QuizzesStore"

export interface QuizItemProps extends RouteComponentProps<any> {
    item: Quiz,
    styles?: React.CSSProperties
}

export interface QuizItemState {}

@observer
export default
class QuizItem
extends React.Component<QuizItemProps, QuizItemState> {

    static defaultProps = {
        styles: {}
    }

    stopLink = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    render() {
        let { item } = this.props
        let isSelected = QuizzesStore.checkedRows.includes(item.id)
        let { toggleCheck } = QuizzesStore
        return <>
            <li 
                style={this.props.styles}
                className={`quize-item-wrap ${isSelected ? "select" : ""}`}
                onClick={() => {this.props.history.push(`/quizzes/${item.id}`)}}
            >
                <Checkbox 
                    item={item}
                    isSelected={isSelected}
                    type="test"
                    className="quiz-item-checkbox"
                />
                <span className="test-name">
                    {item.name}
                </span>
                <p className="test-descr">
                    {item.description}
                </p>
                <div className="quiz-sub-info">
                    <div>
                        Type:
                        <span>
                            {item.type}
                        </span>
                    </div>
                    <div>
                        Duration:
                        <span>
                            {item.duration / 60} min
                        </span>
                    </div>
                </div>
                <div className="quiz-item-buttons">
                    <Link
                        to={`/quizzes/delete/${item.id}`}
                        onClick={this.stopLink}
                    >
                        <Button className="negativeColor mr">
                            Delete test
                        </Button>
                    </Link>
                    <Link
                        to={`/quizzes/edit/${item.id}`}
                        onClick={this.stopLink}
                    >
                        <Button className="mainColor u-icon-btn">
                            &#9998;
                        </Button>
                    </Link>
                </div>
            </li>
        </>
    }
}