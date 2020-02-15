import React from "react"
import Modal from "components/Modals/Default"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { AbortableRequest } from "libs/requests/RequestWrap"
import { importCsv } from "api/message/message"

export interface CsvLoaderProps {
    type: "email" | "number",
    fileData : File,
    onClose: () => void,
    onLoadCsv: (dataList: string[]) => void
    onValidCsv: () => void
}

export interface CsvLoaderState {}

export default
class CsvLoader
extends React.Component<CsvLoaderProps, CsvLoaderState> {

    componentDidMount = () => {
        var { fileData, onLoadCsv, type, onValidCsv } = this.props
        var csvFile = new FormData() 
        csvFile.append("csv", fileData)
        
        let request: AbortableRequest<string[]>
        switch (type) {
            case "email":
                request = importCsv("mails")
                // request
                //     .run(csvFile)
                //     .then((res: string[]) => {
                //         onLoadCsv(res.filter(item => item.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)))
                //     })
                break;
            case "number" :
                request = importCsv("sms")
                // request
                //     .run(csvFile)
                //     .then((res: string[]) => {
                //         onLoadCsv(res.filter(item => item.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)))
                //     })
                break
            default:
                break;
        }
        if (request){
            request
                .run(csvFile)
                .then((res: string[]) => {
                    onLoadCsv(res)
                })
                .catch(err => {
                    console.warn("CSV", err)
                    onValidCsv()
                })
        }
            
    }
    render() {
        return <>
            <Modal
                className="send-csv-modal"
                onClose={this.props.onClose}
            >
                <div>
                    Please wait, loading csv file...
                    <span>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        &nbsp;
                    </span> 
                </div>
            </Modal>
        </>
    }
}