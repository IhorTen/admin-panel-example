import React from "react"
import { RouteComponentProps, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"
import { CreateVariantType } from "typings/Main"

import "styles/views/create-variant"

// Requests
import { createVariant } from "api/variants"

// Components / Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"
import Input from "components/Forms/Inputs/Default"

// Stores
import Notifications from "stores/Notifications"
import VariantsStore from "stores/VariantsStore"


export interface CreateVariantProps extends RouteComponentProps<any> {}

export interface CreateVariantState {
    variantItems: CreateVariantType[],
    inputValue: string,
    loading: boolean
}

export default
class CreateVariant
extends React.Component<CreateVariantProps, CreateVariantState> {
    
    request = createVariant(this.props.match.params.id, this.props.match.params.questId)

    state = {
        variantItems: [] as CreateVariantType[],
        inputValue: "",
        loading: false
    }

    componentDidMount() {
        // Writes created variants in state property variant items from localstorage
        let createdVariants = localStorage.getItem("created_variants")
        if (createdVariants)
            this.setState({
                variantItems: JSON.parse(createdVariants)
            })
    }

    componentWillUnmount() {
        // Delete created variants from localstorage and clear createdVariants list in state
        localStorage.removeItem("created_variants")
        this.request.abort()
        this.state.variantItems = []
    }

    /**
     * Makes a request to the create variant
     * @param data - Data for create new variant (variant_content, is_answer)
     */
    handleSubmit = (data: any) => {
        let { variantItems } = this.state
        let { id, questId } = this.props.match.params
        console.log("Create variants front:", variantItems)
        this.setState({
            loading: true
        })
        
        if(this.state.variantItems.length != 0) {
            this.request.run(variantItems).then(res => {
                Notifications.success("Variants created")
                VariantsStore.addVariants(res)
                console.log("Created variants:", res)
                this.props.history.push(`/quizzes/${id}/question-${questId}`)
            }).catch(err => {
                Notifications.error(err.message)
                console.log(err)
                this.setState({
                    loading: false
                })
            })
        } else {
            this.setState({
                loading: false
            })
            Notifications.error("Сreate at least one answer")
        }
    }

    /**
     * Create new variant item and added into created variants list
     * @param data - Data for create new variant
     */
    createVariant = (data: any) => {
        console.log("DATA:", data)
        let { variantItems, inputValue } = this.state
        let isTrue = (data.is_answer == "true")
        let variantData = { variant_content: inputValue, is_answer: isTrue }

        this.setState({
            variantItems: [...variantItems, variantData],
            inputValue: ""
        }, this.saveCreatedVariants)
    }

    
    // Saved created variants in localstorage
    saveCreatedVariants = () => {
        localStorage.setItem("created_variants", JSON.stringify(this.state.variantItems))
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            inputValue: event.currentTarget.value
        })
    }

    render() {
        let { id, questId } = this.props.match.params
        let { variantItems } = this.state
        return <>
            <Modal
                onClose={() => {this.props.history.push(`/quizzes/${id}/question-${questId}`)}}
                className="create-variant-modal"
            >
                <FormWrap onSubmit={this.createVariant}>
                    <p className="u-modal-title">
                        Create new answers
                    </p>
                    <ul className="created-variants-list">
                        {variantItems.map((item, i) => {
                            return (
                                <li key={i}>
                                    <div className="created-variant-name">
                                        <span>Content: </span>
                                        { item.variant_content }
                                    </div>
                                    <div>
                                        <span>Is-answer: </span>
                                        {`${item.is_answer}`}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="u-modal-inp-wrap">
                        {/* <input 
                            type="text"
                            className="u-modal-inp"
                            placeholder="Answer"
                            name="variant_content"
                            value={this.state.inputValue}
                            onChange={this.handleChange}
                            required
                        /> */}
                        <Input
                            name="variant_content"
                            placeholder="Answer"
                            defaultValue={this.state.inputValue}
                            pattern="[A-Za-z0-9][A-Za-z0-9-\s]*"
                            onChange={this.handleChange}
                            required
                            renderInvalidMessage={key => {
                                switch(key) {
                                    case "valueMissing":
                                        return "Please enter content answer"
                                    case "patternMismatch":
                                        return "Please enter valid answer"
                                    default:
                                        return key
                                }
                            }}
                        />
                    </div>
                    <div className="u-modal-inp-wrap">
                        <select 
                            className="create-variant-select"
                            name="is_answer"
                        >
                            <option value="true">true</option>
                            <option value="false" selected>false</option>
                        </select>
                    </div>
                    <button 
                        className="u-modal-btn create-btn"
                        onClick={(event: React.MouseEvent) => {
                            event.stopPropagation()
                            event.nativeEvent.stopImmediatePropagation()
                        }}
                    >
                        Create
                    </button>
                    <button 
                        className="u-modal-btn"
                        type="button"
                        onClick={this.handleSubmit}
                    >
                        {this.state.loading
                            ? <FontAwesomeIcon icon={faSpinner} spin />
                            : "Submit"
                        }
                    </button>
                </FormWrap>
            </Modal>
        </>
    }
}