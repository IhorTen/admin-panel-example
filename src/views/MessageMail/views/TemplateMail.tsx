import React from "react"
import { observer } from "mobx-react"
import { RouteComponentProps } from "react-router-dom"

import "styles/views/Messages/messageTemplate"

import Button from "components/Misc/Button"
import Form from "components/Forms/FormWrap"
import WYSIWYG from "components/Misc/WYSIWYG"
import MessageStore from "stores/MessageStore"
import {createNewTemplate} from "api/templates/template"
import { TempSaveResponse } from "typings/Main"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export interface TemplateMailProps extends RouteComponentProps<any>{}

export interface TemplateMailState {
    loading: boolean,
    errorSelect: boolean,
    errorCreate: boolean,
    subjectValue: string
}

@observer
export default
class TemplateMail
extends React.Component<TemplateMailProps, TemplateMailState> {
    state = {
        loading: false,
        errorSelect: false,
        errorCreate: false,
        subjectValue: undefined as string
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
            this.props.history.push(`/mails/template/${data.selectTempId}`)
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
    handleSubmit = (data: any): void => {
        var {subjectValue} = this.state
        var tempData: {
            subject: string,
            content: string
        } = {
            subject: subjectValue,
            content: data.description
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
                    MessageStore.addNewTemplate(res)
                    this.setState({
                        loading: false
                    })
                    this.props.history.push(`/mails/template/${res.id}`)
                })
                .catch(err => {
                })
        } else {
            this.setState({
                errorCreate: true
            })
        }      
    }

    /**
     * Watching if template subject is created, if created - set it to state
     * @param event
     */
    handleTemplateSubject = (event: React.FormEvent<HTMLInputElement>) => { 
        this.setState({
            subjectValue: event.currentTarget.value,
            errorCreate: false
        })   
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
                        className={`new-template mails ${errorCreate ? "invalid" : ""}`}
                        onSubmit={this.handleSubmit}
                    >
                        <input 
                            type="text"
                            name="temp-subject"
                            className="temp-subj"
                            placeholder="Template subject..."
                            onChange={this.handleTemplateSubject}
                        />
                        <WYSIWYG
                            addFile={false}
                            className="temp-cont"
                            btnClassName="btnTemplateChange"
                        />
                        {errorCreate &&
                            <p className="invalid">
                                Please create new template (both subject and content) on choose existing
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