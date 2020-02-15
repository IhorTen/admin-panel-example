import React from "react"
import { Link, RouteComponentProps } from "react-router-dom"
import { observer } from "mobx-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'

import "styles/views/create-positions"

// Requests
import { quizTypes } from "api/quizTypes"
import { createPositions } from "api/positions"

//Components / Views
import Modal from "components/Modals/Default"
import FormWrap from "components/Forms/FormWrap"
import Input from "components/Forms/Inputs/Default"

//Stores
import PositionsStore from "stores/PositionsStore"
import Notifications from "stores/Notifications"


export interface CreatePositionsProps extends RouteComponentProps<any>{}

export interface CreatePositionsState {
    quizzes: string[],
    typeQuery: string,
    loading: boolean,
    isVisibleTypes: boolean
    typesList: string[]
}

@observer
export default
class CreatePositions
extends React.Component<CreatePositionsProps, CreatePositionsState> {
    positionName: HTMLInputElement

    request = createPositions()
    quizTypes = quizTypes()

    state = {
        quizzes: [] as string[],
        typeQuery: "",
        loading: false,
        isVisibleTypes: false,
        typesList: [] as string[]
    }

    componentDidMount() {
        // Sends a request to the list of quiz types and writes the result to the state
        this.quizTypes.run().then(res => {
            console.log("Types:", res)
            this.setState({
                typesList: res
            })
        }).catch(err => {
            console.log(err)
        })
    }
    
    componentWillUnmount() {
        // Abort requests on creating position and quiz types
        this.request.abort()
        this.quizTypes.abort()
    }

    /**
     * Added new quiz type in current array types
     * @param event
     */
    addQuizType = (event: React.MouseEvent<HTMLLIElement>) => {
        let { quizzes } = this.state
        let value = event.currentTarget.innerHTML
        let isType = quizzes.includes(value)
        if(isType)
            Notifications.error("This type already exists.")
        else
            this.setState({
                quizzes: [...quizzes, value]
            })
    }

    
    // Sends a request on create position and use function addPosition from PositionsStore
    handleSubmit = (data: any) => {
        let requestData = { name: this.positionName.value, quizzes: this.state.quizzes}
        this.setState({
            loading: true
        })

        if(this.positionName.value) {
            this.request.run(requestData).then(res => {
                Notifications.success("Position created")
                PositionsStore.addPosition(res[0])
                this.props.history.push("/positions")
            }).catch(err => {
                Notifications.error(err.message)
                this.setState({
                    loading: false
                })
            })
        } else {
            this.setState({
                loading: false
            })
            Notifications.error("Enter position name")
        }
    }

    /**
     * Tracks input changes and refresh state property typeQuizzes
     * @param event
     */
    changeTypeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            typeQuery: event.currentTarget.value
        })
    }

    /**
     * Delete selected type from quiz types array
     * @param event
     */
    removeType = (event: React.MouseEvent<HTMLDivElement>) => {
        let quizzes = [...this.state.quizzes]
        let typeName = event.currentTarget.previousSibling.textContent
        let typeIndex = quizzes.indexOf(typeName)
    
        if(typeIndex >= 0)
            quizzes.splice(typeIndex, 1)

        this.setState({
            quizzes: quizzes
        })
    }

    // Change state types list (show/hide)
    handleClick = () => {
        this.setState({
            isVisibleTypes: !this.state.isVisibleTypes
        })
    }
    
    stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation()
        event.nativeEvent.stopImmediatePropagation()

    }

    render() {
        let { quizzes, typesList } = this.state
        return <>
            <Modal onClose={() => {this.props.history.push("/positions")}}>
                <FormWrap
                    onSubmit={this.addQuizType}
                    className="create-positions-form"
                >
                    <p className="u-modal-title">
                        Create new positions
                    </p>
                    <div className="u-modal-inp-wrap">
                        <input
                            type="text"
                            className="u-modal-inp"
                            autoComplete="off"
                            placeholder="Position name"
                            name="name"
                            ref={ref => this.positionName = ref}
                            required
                        />
                    </div>
                    <div className="position-types-list">
                        {/* <input 
                            type="text"
                            name="quizzes"
                            value={this.state.quizzes}
                        /> */}
                        {quizzes.map((type, i) => {
                            return (
                                <div
                                    key={i}
                                    className="position-type-item"
                                >
                                    {type}
                                    <div 
                                        className="delete-type"
                                        onClick={this.removeType}
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
                    <button 
                        className="u-modal-btn"
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