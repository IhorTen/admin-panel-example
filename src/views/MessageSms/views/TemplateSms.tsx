import React from "react"
import { observer } from "mobx-react"
import { RouteComponentProps } from "react-router-dom"

import "styles/views/Messages/messageTemplate"

import Button from "components/Misc/Button"
import Form from "components/Forms/FormWrap"
import MessageStore from "stores/MessageStore"
import {createNewTemplate} from "api/templates/template"
import { TempSaveResponse } from "typings/Main"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export interface TemplateSmsProps extends RouteComponentProps<any> {}

export interface TemplateSmsState {
    loading: boolean,
    errorSelect: boolean,
    errorCreate: boolean
}

@observer
export default
class TemplateSms
extends React.Component<TemplateSmsProps, TemplateSmsState> {
    state = {
        loading: false,
        errorSelect: false,
        errorCreate: false
    }

    /**
     * Watching if template is selected
     * @param event
     */
    handleChangeSelect = (event: React.FormEvent<HTMLSelectElement>) => {
        if (event.currentTarget.value){
            this.setState({
                errorSelect: false
            })
        }
    }

    /**
     * Submit if template is selected, is not - throw error
     * @param {{selectTempId: string}} data
     */
    handleSelect = (data: {selectTempId: string}) => {
        if (data.selectTempId != undefined){
            this.props.history.push(`/sms/template/${data.selectTempId}`)
        } else {
            this.setState({
                errorSelect: true
            })
        }  
    }

    /**
     * Submit if template`s subject and content created and send request for saving created template, if now - throw error
     * @param {{temp_subject: string, temp_content: string}} data Cteated template data
     */
    handleSubmit = (data: {temp_subject: string, temp_content: string}): void => {
        var tempData: {
            subject: string,
            content: string
        } = {
            subject: data.temp_subject,
            content: data.temp_content
        }
        
        if(tempData.subject && tempData.content){

            this.setState({
                loading: true,
                errorCreate: false
            })
            console.log("Temp Data", tempData)

            createNewTemplate()
                .run(tempData)
                .then((res: TempSaveResponse) => {
                    console.log("CreateTemp",res)
                    MessageStore.addNewTemplate(res)
                    this.setState({
                        loading: false
                    })
                    this.props.history.push(`/sms/template/${res.id}`)
                    console.log("new template", tempData)
                    
                })
                .catch(err => {
                    console.warn("CreateTemp",err)
                })
        } else {
            this.setState({
                errorCreate: true
            })
        } 
    }

    /**
     * Watching if template is created
     */
    handleChangeCreate = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(event.currentTarget.value){
            this.setState({
                errorCreate: false
            })
        }
    }

    render() {
        const { templates } = MessageStore
        var { loading, errorSelect, errorCreate } = this.state

        return <>
            <div className="message-template">
                <div className="use-template">
                    <h2 className="use-template-head">
                        Use template
                    </h2>
                    <Form 
                        className="use-template-body"
                        onSubmit={this.handleSelect}
                    >
                        <select 
                            name="selectTempId" 
                            className={`select-templates ${errorSelect? "invalid" : ""}`}
                            onChange={this.handleChangeSelect}
                        >
                            <option value="">
                                Select template
                            </option>
                            {templates
                                ? templates.map((temp, i) => {
                                    return (
                                        <option 
                                            value={temp.id}
                                            key={i}
                                        >
                                            {temp.subject}
                                        </option>
                                    )
                                })
                                : <option value="">
                                    Loading...
                                </option>
                            }
                        </select>
                        {errorSelect &&
                            <p className="invalid">
                                Please choose template or create new
                            </p>
                        }
                    <Button
                        className="mainColor btn-go"
                        type="submit"
                    >
                        Go
                    </Button>
                    </Form>
                </div>
                <h3 className="template-txt">
                    Or
                </h3>
                <div className="create-template">
                    <h2 className="create-template-head">
                        Create new
                    </h2>
                    <Form 
                        className={`new-template ${errorCreate ? "invalid" : ""}`}
                        onSubmit={this.handleSubmit}
                    >
                        <input 
                            type="text"
                            name="temp_subject"
                            className="temp-subj"
                            placeholder="Template subject..."
                            onChange={this.handleChangeCreate}
                        />
                        <textarea 
                            name="temp_content" 
                            className="temp-cont sms"
                            rows={10}
                            placeholder="Sms content..."
                            onChange={this.handleChangeCreate}
                        />
                        {errorCreate &&
                            <p className="invalid">
                                Please create new template on choose existing
                            </p>
                        }
                        <Button
                            className="mainColor btn-create-new-temp"
                            type="submit"
                            disabled={loading}
                        >
                            {loading && 
                                <span>
                                    <FontAwesomeIcon icon={faSpinner} spin />
                                    &nbsp;
                                </span> 
                            }
                            Create new template
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    }
}