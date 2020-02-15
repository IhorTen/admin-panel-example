import React from "react"
import { RouteComponentProps, Redirect } from "react-router-dom"
import { observer } from "mobx-react"

import "styles/views/Messages/messageSend"

import Form from "components/Forms/FormWrap"
import Button from "components/Misc/Button"
import WYSIWYG from "components/Misc/WYSIWYG"
import CsvLoader from "components/CsvLoader"
import MessageStore from "stores/MessageStore"
import { updateTemplate } from "api/templates/template"
import { SendMessage } from "typings/Main"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { sendTemplate } from "utils/sendTemplate"

export interface SendEmailProps extends RouteComponentProps<any>{}

export interface SendEmailState {
    emailsList: string[],
    value: string,
    loading: boolean,
    isValid: boolean,
    csvFile: File,
    isChanged: boolean
}

@observer
export default
class SendEmail
extends React.Component<SendEmailProps, SendEmailState> {
    state = {
        emailsList: [] as string[],
        value: "",
        loading: false,
        isValid: true,
        csvFile: undefined as File,
        isChanged: false
    }
    
    formData: SendMessage
    currTemp = MessageStore.getTemplateById(this.props.match.params.id)

    templateData = this.currTemp 
        ? {
            subject: this.currTemp.subject,
            content: this.currTemp.content
        } 
        : undefined

    newTemplateData = {
        subject: this.templateData.subject,
        content: this.templateData.content
    }
    
    /**
     * Watching for entering recipients information
     * @param event
     */
    handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            value: event.currentTarget.value,
            isValid: true
        })
    }
    
    /**
     * Add recipient email to emailsList if valid
     * @param {boolean} isValid
     */
    addRecipientEmail = () => {
        var {value,emailsList} = this.state
        var email = value.trim()
        if (!!email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)) {
            this.setState({
                emailsList: [...emailsList, email],
                value: "",
                isValid: true
            })
        } else {
            this.setState({
                isValid: false
            })
        }
    }

    onBlurAddRecipients = () => {
        this.addRecipientEmail()
    }

    onKeyDownAddRecipients = (event: React.KeyboardEvent) => {
        if (["Enter", "Tab"].includes(event.key)){
            event.preventDefault()
            this.addRecipientEmail()
        }
    }

    deleteRecipientEmail = (toBeRemoved: string) => {
        var { emailsList } = this.state
        emailsList.splice(emailsList.indexOf(toBeRemoved), 1)
        this.setState({ emailsList })
    }

    isTemplateChanged = () => {
            if (this.templateData.subject == this.newTemplateData.subject && this.templateData.content == this.newTemplateData.content){
                this.setState({
                    isChanged: false
                })
            } else {
                this.setState({
                    isChanged: true
                })
            }
    }

    isSubjectChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.newTemplateData.subject = event.currentTarget.value
        this.isTemplateChanged()
    }

    isContentChanged = (data?: string) => {
        this.newTemplateData.content = data
        this.isTemplateChanged()
    }

    /**
     * Get data,check validation, set fata, checking if its need to save template, make request for sending template and saving template
     * @param {{subject: string, content: string, saveAndSend?: string}} data contains template data and recipient list
     */
    handleSubmit = (data: {subject: string, description: string, saveAndSend?: string}) => {
        var { emailsList, isValid } = this.state
        var { id }  = this.props.match.params

        if (!emailsList.length || !isValid){
            return this.setState({
                isValid: false
            })
        } else {
            this.formData = {
                id,
                subject: data.subject,
                content: data.description,
                recipient: emailsList
            }
            this.setState({
                loading: true
            })
            sendTemplate(this.formData, "mails")
                .finally(() => {
                    this.props.history.push("/mails")
                })
            if (!!data.saveAndSend) {
                updateTemplate(this.formData.id)
                    .run({
                    subject: this.formData.subject,
                    content: this.formData.content
                    })
            }
        }
    }

    handleClose = () => {
        this.props.history.push(`/mails/template/${this.props.match.params.id}`)
    }

    /**
     * Watching for downloading csv file
     * @param event
     */
    handleFileInput = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            csvFile: event.currentTarget.files[0]
        })
        event.currentTarget.value = ""
    }

     /**
     * Seting recipients email(s) to state, check validation
     * @param {string[]} emails list of emails (getting from csv file)
     */
    onLoadCsv = (emails: string[]) => {
        var {emailsList} = this.state
        this.setState({
            emailsList: [...emailsList, ...emails],
            csvFile: undefined as File,
            isValid: true
        })
        if(emails.length == 0){
            this.setState({
                isValid: false
            })
        }
    }

    /**
     * Make csv input invalid if request throw catch
     */
    onValidCsv = () => {
        this.setState({
            isValid: false
        })
    }
    
    render() {
        var { emailsList, value, loading, isValid, csvFile, isChanged } = this.state
        const currTemp = MessageStore.getTemplateById(this.props.match.params.id)

        return <>
            {!currTemp
                ? <Redirect to="/mails/template"/>
                : <div className="template-send-to">
                    <div className="send-to-content ">
                        <h2 className="send-to-tittle">
                            Send to
                        </h2>
                        <form className="recipients-data">
                            <div className={`data-chip-wrap ${!isValid && emailsList.length <= 0 ? "invalid" : ""}`}>
                                {emailsList.map((email, i) => 
                                    <div
                                        key={i}
                                        className="data-chip"
                                    >
                                        {email}
                                        <button
                                            type="button"
                                            className="chip-btn"
                                            onClick={() => this.deleteRecipientEmail(email)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                                <input 
                                    className="recipients-input"
                                    type="email"
                                    name="recepients-emails"
                                    placeholder="Type email and press Enter"
                                    autoComplete="off"
                                    value={value}
                                    onChange={this.handleInputChange}
                                    onKeyDown={this.onKeyDownAddRecipients}
                                    onBlur={this.onBlurAddRecipients}
                                />
                            </div>
                            {!isValid && emailsList.length <= 0 &&
                                <p className="invalid">
                                    Please type a correct email!
                                </p>
                            }
                            <label 
                                htmlFor="download-file" 
                                className="download-file"
                            >
                                <input 
                                    type="file" 
                                    id="download-file"
                                    accept=".csv"
                                    onChange={this.handleFileInput}
                                />
                                Import csv
                            </label>
                        </form>
                        <Form 
                            className="modify-template mail"
                            onSubmit={this.handleSubmit}
                        >
                            <input 
                                type="text"
                                defaultValue={currTemp.subject}
                                className="temp-name"
                                name="subject"
                                onChange={this.isSubjectChanged}
                            />
                            <WYSIWYG
                                defaultValue={currTemp.content}
                                addFile={false}
                                className="temp-cont "
                                btnClassName="btnTemplateChange"
                                onChanged={this.isContentChanged}
                            />
                            <div className="btn-send-wrap">
                                <Button
                                    className="mainColor btn-send"
                                    type="submit"
                                    id="sendTemp"
                                    disabled={loading}
                                >
                                    {loading &&
                                        <span>
                                            <FontAwesomeIcon icon={faSpinner} spin />
                                            &nbsp;
                                        </span> 
                                    }
                                    Send
                                </Button>
                                {isChanged &&
                                    <label htmlFor="sendAndSaveTemp">
                                        <input 
                                            type="checkbox"
                                            id="sendAndSaveTemp"
                                            name="saveAndSend"
                                        />
                                        Save template
                                    </label>
                                }
                            </div>
                        </Form>
                        {csvFile &&
                            <CsvLoader
                                type="email"
                                fileData={csvFile}
                                onClose={this.handleClose}
                                onLoadCsv={this.onLoadCsv}
                                onValidCsv={this.onValidCsv}
                            />
                        }
                    </div>
                </div>
            }
        </>
    }
}