import React from "react"
import { TestData, QuestData, Variant, Quest } from "typings/Main"

import "styles/components/forms/inputs/checkbox"

import VariantsStore from "stores/VariantsStore"
import QuestsStore from "stores/QuestsStore"
import QuizzesStore from "stores/QuizzesStore"

export interface CheckboxProps {
    // item: TestData | Quest | Variant,
    item: any,
    isSelected: boolean,
    type: "test" | "quest" | "answer",
    className: string
    // onToggle
}

export interface CheckboxState {}

export default
class Checkbox
extends React.Component<CheckboxProps, CheckboxState> {

    static defaultProps = {
        className: ""
    }

    /**
     * Change state/styles checkbox
     * @param event
     * @param {string} type - Type of element the checkbox is in
     */
    toggleCheck = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        switch(type) {
            case "test":
                QuizzesStore.toggleCheck(event, this.getElementId)
                break;
            case "quest":
                QuestsStore.toggleCheck(event, this.getElementId)
                break;
            case "answer":
                VariantsStore.toggleCheck(event, this.getElementId)
                break;
        }
    }

    
    // Gets element id
    get getElementId() {
        switch(this.props.type) {
            case "test":
                return this.props.item.id
            case "quest":
                return this.props.item.question_id
            case "answer":
                return this.props.item.variant_id
        }
    }

    stopLink = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()       
    }

    render() {
        let { isSelected, type } = this.props
        let itemId = this.getElementId
        return <>
            <div className={`custom-check-wrap ${this.props.className}`}>
                <input
                    type="checkbox"
                    id={`check${itemId}`}
                    name="test-check"
                    className="u-check"
                    onClick={this.stopLink}
                    onChange={event => this.toggleCheck(event, type)}
                    checked={isSelected}
                />
                <label
                    htmlFor={`check${itemId}`}
                    onClick={this.stopLink}
                >
                    <div className="u-custom-check"></div>
                </label>
            </div>
        </>
    }
}