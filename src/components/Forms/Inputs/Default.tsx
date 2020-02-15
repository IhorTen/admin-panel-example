import React from "react"

import "styles/components/forms/inputs/default-input"

export type InputType = 
    "text" | 
    "email" | 
    "file" | 
    "tel" | 
    "datetime-local" | 
    "number" | 
    "password"
export type InvalidKey = keyof ValidityState

export interface InputProps {
    type?: InputType,
    name?: string,
    accept?: string,
    required?: boolean,
    pattern?: string,
    defaultValue?: string,
    placeholder?: string,
    label?: React.ReactNode,
    className?: string,
    min?: string | number,
    max?: string | number,
    renderInvalidMessage?: (key: InvalidKey) => React.ReactNode,
    onChange?: (event: React.FormEvent<HTMLInputElement>) => void
}

export interface InputState {
    value: string | number,
    invalid: InvalidKey | void
}

export default
class Input
extends React.Component<InputProps, InputState> {
    static defaultProps = {
        type: "text",
        required: false,
        defaultValue: "",
        renderInvalidMessage: (key: InvalidKey) => key,
        onChange: undefined as void
    }

    state = {
        invalid: undefined as InvalidKey,
        value: this.props.defaultValue
    }

    static getInvalidKey = (validity: ValidityState): InvalidKey | void => {
        let invalidKey: InvalidKey
        for(invalidKey in validity) {
            if(invalidKey != "valid" && validity[invalidKey])
                break
        }

        return invalidKey
    }

    handleInvalid = (event: React.FormEvent<HTMLInputElement>) => {
        event.preventDefault()
        this.setState({
            invalid: Input.getInvalidKey(event.currentTarget.validity)
        })
    }

    handleChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            value: event.currentTarget.value,
            invalid: undefined
        })
        if(this.props.onChange)
            this.props.onChange(event)
    }

    render() {
        let { value, invalid } = this.state
        let filled = !!value
        return <>
            <div className={`form-input ${filled ? "filled" : ""} ${invalid ? "invalid" : ""}`}>
                {this.props.label &&
                    <label htmlFor={`${this.props.name}-id`}>
                        {this.props.label}
                    </label>
                }
                <div className="form-input-wrap">
                    <input
                        className={this.props.className}
                        id={`${this.props.name}-id`}
                        name={this.props.name}
                        type={this.props.type}
                        required={this.props.required}
                        accept={this.props.accept}
                        placeholder={this.props.placeholder}
                        pattern={this.props.pattern}
                        value={value}
                        onChange={this.handleChange}
                        onInvalid={this.handleInvalid}
                        autoComplete="off"
                    />
                </div>
                {invalid &&
                    <p className="invalid">
                        {this.props.renderInvalidMessage(invalid)}
                    </p>
                }
            </div>
        </>
    }
}