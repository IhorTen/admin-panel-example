import React from "react"


export interface FormWrapProps {
    className?: string,
    onSubmit?: (data: any) => void
}

export interface FormWrapState {
}

export default
class FormWrap
extends React.Component<FormWrapProps, FormWrapState> {
    static defaultProps = {
        className: ""
    }

    /**
     * Сollects data and passes to the child function
     * @param event
     */
    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            let data: any = {}
    
            ;[...event.currentTarget.elements].forEach((element: HTMLInputElement) => {
                let value: string | ArrayBuffer = element.value
                if (value) {
                    switch(element.type){
                        case "file":
                            let reader = new FileReader()
                            reader.onload = function() {
                                value = reader.result
                            }
                            break
                        case "checkbox":
                            if (element.checked)
                                data[element.name] = element.value
                            break
                        default:
                            data[element.name] = element.value
                    }
                }
            })
            this.props.onSubmit(data)
        } catch (err) {
            console.log(err)
        }
        return false
    }

    render() {
        return <>
            <form 
                className={`form-wrap ${this.props.className}`}
                onSubmit={this.handleSubmit}
            >
                {this.props.children}
            </form>
        </>
    }
}