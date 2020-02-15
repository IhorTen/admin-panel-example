import React from "react"
import { Link } from "react-router-dom"
import { observer } from "mobx-react"
import { RouteComponentProps } from "react-router-dom"
import { Quest } from "typings/Main"

import "styles/components/quest-item"

// Components / Views
import Button from "components/Misc/Button"
import Checkbox from "components/Forms/Inputs/Checkbox"

// Stores
import QuestsStore from "stores/QuestsStore"

export interface QuestItemProps extends RouteComponentProps<any> {
    dataQuest?: Quest,
    styles?: React.CSSProperties
}

export interface QuestItemState {}

@observer
export default
class QuestItem
extends React.Component<QuestItemProps, QuestItemState> {

    stopLink = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    render() {
        let { id } = this.props.match.params
        let { dataQuest } = this.props
        let isSelected = QuestsStore.checkedRows.includes(dataQuest.question_id)
        return <>
            <li
                style={this.props.styles}
                className="quest-item-wrap"
            >
                <Link
                    to={`/quizzes/${id}/question-${dataQuest.question_id}`}
                    className="quest-item"
                    style={{
                        background: isSelected ? "#eee" : "#fff"
                    }}
                >
                    <div className="quest-left">
                        <Checkbox 
                            item={dataQuest}
                            isSelected={isSelected}
                            type="quest"
                        />
                        <div 
                            className="quest-name" 
                            dangerouslySetInnerHTML={{__html: dataQuest.question_content}}
                        />
                    </div>
                    <div className="quest-right">
                        <Link
                            to={`/quizzes/${id}/delete/${dataQuest.question_id}`}
                            onClick={this.stopLink}
                        >
                            <Button className="negativeColor mr">
                                Delete Question
                            </Button>
                        </Link>
                        <Link
                            to={`/quizzes/${this.props.match.params.id}/edit/${dataQuest.question_id}`}
                            onClick={this.stopLink}
                        >
                            <Button className="mainColor u-icon-btn">
                                &#9998;
                            </Button>
                        </Link>
                    </div>
                </Link>
            </li>
        </>
    }
}