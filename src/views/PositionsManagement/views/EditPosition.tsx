import React from "react"
import { Link, RouteComponentProps, Redirect } from "react-router-dom"
import { observer } from "mobx-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'

import "styles/views/edit-position"

// Requests
import { editPosition } from "api/positions"
import { quizTypes } from "api/quizTypes"

// Components Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"

// Stores
import PositionsStore from "stores/PositionsStore"
import Notifications from "stores/Notifications"


export interface EditPositionProps extends RouteComponentProps<any> {}

export interface EditPositionState {
    typeQuery: string,
    loading: boolean,
    isVisibleTypes: boolean,
    typesList: string[]
}

export type PositionData = {
    name: string,
    quizzes: string[]
}

@observer
export default
class EditPosition
extends React.Component<EditPositionProps, EditPositionState> {

    private typeQuery: HTMLInputElement

    request = editPosition(this.props.match.params.positionId)
    quizTypes = quizTypes()

    state = {
        typeQuery: "",
        loading: false,
        isVisibleTypes: false,
        typesList: [] as string[]
    }
    
    componentDidMount() {
        // Makes a request to list quiz types
        this.quizTypes.run().then(res => {
            console.log("Types:", res)
            this.setState({
                typesList: res
            })
        }).catch(err => {
            console.log(err)
        })
    }
    
    /**
     * Writed input value in state property typeQuery
     * @param data
     */
    handleEdit = (data: any) => {
        this.setState({
            typeQuery: ""
        })
    }
    
    // Makes a request to edit position
    handleSubmit = () => {
        if(PositionsStore)
            var position = PositionsStore.getPositionById(this.props.match.params.positionId)
        if(position)
            var requestData = {name: this.typeQuery.value, quizzes: position.quizzes}

        this.setState({
            loading: true
        })

        this.request.run(requestData).then(res => {
            Notifications.success("Success")
            PositionsStore.editPosition(res)
            this.props.history.push("/positions")
        }).catch(err => {
            Notifications.error(err.message)
            console.log(err)
            this.setState({
                loading: false
            })
        })
    }

    /**
     * Writed input value in type
     * @param event
     */
    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            typeQuery: event.currentTarget.value
        })
    }

    /**
     * Change state quiz types list (show/hide)
     * @param event
     */
    handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        this.setState({
            isVisibleTypes: !this.state.isVisibleTypes
        })
    }

    /**
     * Added new quiz type in current array types
     * @param event
     */
    addQuizType = (event: React.MouseEvent<HTMLLIElement>) => {
        let type = event.currentTarget.innerHTML
        var position = PositionsStore.getPositionById(this.props.match.params.positionId)
        if(position)
            var isType = position.quizzes.includes(type)

        if(isType)
            Notifications.error("This type already exists.")
        else
            PositionsStore.addType(this.props.match.params.positionId, type)
    }

    /**
     * Delete selected quiz type
     * @param event
     */
    deleteQuizType = (event: React.MouseEvent<HTMLDivElement>) => {
        let { positionId } = this.props.match.params
        let typeName = event.currentTarget.previousSibling.textContent

        PositionsStore.removeType(positionId ,typeName)
    }

    stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()
    }

    render() {
        let { typeQuery, typesList } = this.state
        if(PositionsStore.positions)
            var currentPosition = PositionsStore.getPositionById(this.props.match.params.positionId)
        if(!currentPosition)
            return <Redirect to="/positions"/>
        return <>
            <Modal
                className="edit-position-modal"
                onClose={() => {this.props.history.push("/positions")}}
            >
                <FormWrap onSubmit={this.handleEdit}>
                    <p className="u-modal-title">
                        Edit Position
                    </p>
                    <div className="u-modal-inp-wrap">
                        <input 
                            type="text"
                            className="u-modal-inp"
                            placeholder="Position Name"
                            name="name"
                            defaultValue={currentPosition.name}
                            ref={ref => this.typeQuery = ref}
                            required
                        />
                    </div>
                    <div className="position-types-list">
                        {currentPosition.quizzes.map((type, i) => {
                            return (
                                <div
                                    key={i}
                                    className="position-type-item"
                                >
                                    {type}
                                    <div 
                                        className="delete-type"
                                        onClick={this.deleteQuizType}
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </div>
                                </div>
                            )
                        })}
                        <div 
                            className="add-type-btn"
                            onClick={this.handleClick}
                        >
                            <span>+</span>
                            {this.state.isVisibleTypes && 
                                <ul className="types-list">
                                    {typesList.map((item, i) => {
                                        return (
                                            <li 
                                                key={i}
                                                onClick={this.addQuizType}
                                            >
                                                { item }
                                            </li>
                                        )
                                    })}
                                </ul>
                            }
                        </div>
                    </div>
                    <div className="u-modal-input-wrap">
                        <button 
                            className="u-modal-btn"
                            type="button"
                            onClick={this.handleSubmit}
                        >
                            {this.state.loading
                                ? <FontAwesomeIcon icon={faSpinner} spin /> 
                                : "Edit"
                            }
                        </button>
                    </div>
                </FormWrap>
            </Modal>
        </>
    }
}