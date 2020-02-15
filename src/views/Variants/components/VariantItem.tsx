import React from "react"
import { Link, RouteComponentProps } from "react-router-dom"
import { Variant } from "typings/Main"
import { observer } from "mobx-react"

import "styles/components/variant-item"

// Components / Views
import Button from "components/Misc/Button"
import Checkbox from "components/Forms/Inputs/Checkbox"

// Stores
import VariantsStore from "stores/VariantsStore"

export interface VariantItemProps extends RouteComponentProps<any> {
    answerData?: Variant,
    styles: React.CSSProperties
}

export interface VariantItemState {
    
}

@observer
export default
class VariantItem
extends React.Component<VariantItemProps, VariantItemState> {

    stopLink = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    render() {

        let { answerData } = this.props
        let isSelected = VariantsStore.checkedRows.includes(answerData.variant_id)
        let { id, questId } = this.props.match.params

        return <>
            <li
                className="answer-item-wrap"
                style={this.props.styles}
            >
                <div
                    className="answer-item"
                    style={{
                        background: isSelected ? "#eee" : "#fff"
                    }}
                >
                    <div className="answer-left">
                        <Checkbox
                            item={answerData}
                            isSelected={isSelected}
                            type="answer"
                        />
                        <span 
                            className="answer-name"
                            dangerouslySetInnerHTML={{__html: answerData.variant_content}}
                        />
                    </div>
                    <div className="answer-right">
                        <p className="is-answer">
                            <span>is answer: </span>
                            {`${answerData.is_answer}`}
                        </p>
                        <Link
                            to={`/quizzes/${id}/question-${questId}/answer-${answerData.variant_id}/delete`}
                            onClick={this.stopLink}
                        >
                            <Button className="negativeColor mr">
                                Delete answer
                            </Button>
                        </Link>
                        <Link
                            to={`/quizzes/${id}/question-${questId}/answer-${answerData.variant_id}/edit`}
                            onClick={this.stopLink}
                        >
                            <Button className="mainColor u-icon-btn">
                                &#9998;
                            </Button>
                        </Link>
                    </div>
                </div>
            </li>
        </>
    }
}