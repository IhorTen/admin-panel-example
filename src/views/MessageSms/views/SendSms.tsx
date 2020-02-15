import React from "react"
import { RouteComponentProps, Redirect } from "react-router-dom"
import { observer } from "mobx-react"

import "styles/views/Messages/messageSend"

import Form from "components/Forms/FormWrap"
import Button from "components/Misc/Button"
import CsvLoader from "components/CsvLoader"
import MessageStore from "stores/MessageStore"
import { updateTemplate } from "api/templates/template"
import { SendMessage } from "typings/Main"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { sendTemplate } from "utils/sendTemplate"

export interface SendSmsProps extends RouteComponentProps<any> {}

export interface SendSmsState {
    numberList: string[],
    value: string,
    loading: boolean,
    isValid: boolean,
    csvFile: File,
    isChanged: boolean
}

@observer
export default
class SendSms
extends React.Component<SendSmsProps, SendSmsState> {
    state = {
        numberList: [] as string[],
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
     * Add recipient number to numberList if its valid
     * @param {boolean} isValid
     */
    addRecipientNumber = () => {
        var {value,numberList} = this.state
        var phoneNum = value.trim()
        if (!!phoneNum.match(/^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{9})$/gm)) {
            this.setState({
                numberList: [...numberList, phoneNum],
                value: "",
                isValid: true
            })
        } else {
            this.setState({
                isValid: false
            })
        }
    }

    onBlurRecipients = ( event: React.ChangeEvent<HTMLInputElement>) => {
        // event.preventDefault()
        this.addRecipientNumber()
    }

    onKeyDownRecipients = (event: React.KeyboardEvent) => {
        if (["Enter", "Tab"].includes(event.key)){
            // event.preventDefault()
            this.addRecipientNumber()
        }
    }

    deleteRecipientNumber = (toBeRemoved: string) => {
        var { numberList } = this.state
        numberList.splice(numberList.indexOf(toBeRemoved), 1)
        this.setState({ numberList })
    }

    /**
     * Watching if template changed
     * @param {React.FormEvent<HTMLTextAreaElement | HTMLInputElement>} event
     */
    isContentChanged = (event: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        let target = event.currentTarget
        let currTemp = MessageStore.getTemplateById(this.props.match.params.id)
        if(currTemp){
            if(target instanceof HTMLInputElement){
                this.templateData.subject = target.value
            } else
                this.templateData.content = target.value

            if (currTemp.subject == this.templateData.subject && currTemp.content == this.templateData.content){
                this.setState({
                    isChanged: false
                })
            } else {
                this.setState({
                    isChanged: true
                })
            }
        }
    }

    /**
     * Get data,check validation, set fata, checking if its need to save template, make request for sending template and saving template
     * @param {{subject: string, content: string, saveAndSend?: string}} data contains template data and recipient list
     */
    handleSubmit = (data: {subject: string, content: string, saveAndSend?: string}) => {
        var { numberList, isValid } = this.state
        var { id }  = this.props.match.params
        if (!numberList.length || !isValid){
            return this.setState({
                isValid: false
            })
        } else {
            this.formData = {
                id,
                subject: data.subject,
                content: data.content,
                recipient: numberList
            }
            this.setState({
                loading: true
            })

            sendTemplate(this.formData, "sms")
                .finally(() => {
                    this.props.history.push("/sms")
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
        this.props.history.push(`/sms/template/${this.props.match.params.id}`)
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
     * Seting recipients phoneNumber(s) to state, check validation
     * @param {string[]} phoneNum list of phone numbers (getting from csv file)
     */
    onLoadCsv = (phoneNum: string[]) => {
        var {numberList} = this.state

        this.setState({
            numberList: [...numberList,...phoneNum],
            csvFile: undefined as File,
            isValid: true
        })
        if(phoneNum.length == 0){
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
        var { numberList, value, loading, isValid, csvFile, isChanged } = this.state
        const currTemp = MessageStore.getTemplateById(this.props.match.params.id)

        return <>
            {!currTemp
                ? <Redirect to="/sms/template"/>
                : <div className="template-send-to">
                    <div className="send-to-content">
                        <h2 className="send-to-tittle">
                            Send to
                        </h2>
                        <Form 
                            className="recipients-data" 
                            onSubmit={() => this.setState}
                        >
                            <div className={`data-chip-wrap ${!isValid && numberList.length <= 0 ? "invalid" : ""}`}>
                                {numberList.map((number, i) => 
                                    <div
                                        key={i}
                                        className="data-chip"
                                    >
                                        {number}
                                        <button
                                            type="button"
                                            className="chip-btn"
                                            onClick={() => this.deleteRecipientNumber(number)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                )}
                                <input 
                                    className="recipients-input"
                                    type="phoneNumber"
                                    name="recepients-phone"
                                    placeholder="Type phone number and press Enter"
                                    autoComplete="off"
                                    value={value}
                                    onChange={this.handleInputChange}
                                    onKeyDown={this.onKeyDownRecipients}
                                    onBlur={this.onBlurRecipients}
                                />
                            </div>
                            {!isValid && numberList.length <= 0 &&
                                <p className="invalid">
                                    Please type a correct number! Examle +380931234567
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
                        </Form>
                        <Form 
                            className="modify-template sms"
                            onSubmit={this.handleSubmit}
                        >
                            <input 
                                type="text"
                                defaultValue={currTemp.subject}
                                className="temp-name"
                                name="subject"
                                onChange={this.isContentChanged}
                            />
                            <textarea 
                                name="content"
                                className="temp-cont sms"
                                rows={10}
                                defaultValue={currTemp.content}
                                onChange={this.isContentChanged}
                            />
                            <Button
                                className="mainColor btn-send"
                                type="submit"
                                id="sendTemplate"
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
                        </Form>
                        {csvFile &&
                            <CsvLoader
                                type="number"
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