import React from "react"
import { RouteComponentProps, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"

// Requests
import { editVariant } from "api/variants"

// Components / Views
import FormWrap from "components/Forms/FormWrap"
import Modal from "components/Modals/Default"

// Stores
import VariantsStore from "stores/VariantsStore"
import Notifications from "stores/Notifications"

export interface EditVariantProps extends RouteComponentProps<any> {}

export interface EditVariantState {
    loading: boolean
}

export default
class EditVariant
extends React.Component<EditVariantProps, EditVariantState> {

    request = editVariant(this.props.match.params.id, this.props.match.params.questId, this.props.match.params.variantId)

    state = {
        loading: false
    }

    componentWillUnmount() {
        this.request.abort()
    }

    /**
     * Makes a request to the edit variant
     * @param data - Changed variant data
     */
    handleSubmit = (data: any) => {
        let { id, questId } = this.props.match.params
        let isTrue = (data.is_answer == "true")
        console.log("Variant data:", data)
        let newData = {variant_content: data.variant_content, is_answer: isTrue}
        this.setState({
            loading: true
        })

        this.request.run(newData).then(res => {
            Notifications.success("Variant edited")
            console.log(res)
            VariantsStore.editVariant(res)
            this.props.history.push(`/quizzes/${id}/question-${questId}`)
        }).catch(err => {
            Notifications.error(err.message)
            console.log(err)
            this.setState({
                loading: false
            })
        })
    }

    render() {
        let { id, questId, variantId } = this.props.match.params
        let currentAnswer = VariantsStore.getVariantById(variantId)
        return <>
            <Modal
                onClose={() => this.props.history.push(`/quizzes/${id}/question-${questId}`)}
                className="create-test-modal"
            >
                <FormWrap onSubmit={this.handleSubmit}>
                    <p className="u-modal-title">
                        Edit Variant
                    </p>
                    <div className="u-modal-inp-wrap">
                        <input 
                            type="text"
                            className="u-modal-inp"
                            placeholder="Variant"
                            name="variant_content"
                            defaultValue={currentAnswer.variant_content}
                            required
                        />
                    </div>
                    <div className="u-modal-inp-wrap">
                        <select
                            className="u-modal-select"
                            name="is_answer"
                        >
                            <option value="true">true</option>
                            <option value="false" selected>false</option>
                        </select>
                    </div>
                    <button 
                        className="u-modal-btn"
                        onClick={(event: React.MouseEvent) => {
                            event.stopPropagation()
                            event.nativeEvent.stopImmediatePropagation()
                        }}
                    >
                        {this.state.loading
                            ? <FontAwesomeIcon icon={faSpinner} spin />
                            : "Edit"
                        }
                    </button>
                </FormWrap>
            </Modal>
        </>
    }
}