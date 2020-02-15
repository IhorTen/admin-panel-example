import React from "react"
import { RouteComponentProps, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons"

// Requests
import { deleteVariant } from "api/variants"

// Components / Views
import Modal from "components/Modals/Default"

// Stores
import Notifications from "stores/Notifications"
import VariantsStore from "stores/VariantsStore"

export interface DeleteVariantProps extends RouteComponentProps<any> {}

export interface DeleteVariantState {
    loading: boolean
}

export default
class DeleteVariant
extends React.Component<DeleteVariantProps, DeleteVariantState> {

    request = deleteVariant(this.props.match.params.id, this.props.match.params.questId, this.props.match.params.variantId)

    state = {
        loading: false
    }
    
    componentWillUnmount() {
        this.request.abort()
    }

    // Makes a request to the delete
    handleClick = () => {
        let { variants, removeVariant, removeSelected, getVariantById, checkedRows } = VariantsStore
        let {id, questId, variantId } = this.props.match.params
        let currentVariant = getVariantById(variantId)

        this.setState({
            loading: true
        })

        if(variantId == "all") {
            removeSelected()
        } else {
            let selectIndex = checkedRows.indexOf(currentVariant.variant_id)
                removeVariant(currentVariant)
            if(selectIndex >= 0)
                checkedRows.splice(selectIndex, 1)
        }
        
        this.request.run().then(res => {
            // VariantsStore.removeVariant(currentVariant)
            Notifications.success(res.message)
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
        let { id, questId } = this.props.match.params
        return <>
            <Modal
                onClose={() => {this.props.history.push(`/quizzes/${id}/question-${questId}`)}}
                className="delete-quest-modal"
            >
                <form className="delete-test-form">
                    <p className="delete-test-title">
                        { this.props.match.params.id == "all"
                            ? "Delete Answers?"
                            : "Delete Answer?"
                        }
                    </p>
                    <div className="delete-test-btns">
                        <button 
                            className="del-test-btn color-main-bg"
                            onClick={this.handleClick}
                        >
                            {this.state.loading
                                ? <FontAwesomeIcon icon={faSpinner} spin />
                                : "Yes"
                            }
                        </button>
                        <Link to={`/quizzes/${id}/question-${questId}`}>
                            <button 
                                className="del-test-btn negative-bg"
                                type="button"
                            >
                                No
                            </button>
                        </Link>
                    </div>
                </form>
            </Modal>
        </>
    }
}