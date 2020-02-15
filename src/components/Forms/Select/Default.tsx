import React from "react"
import { observer } from "mobx-react"

import "styles/components/forms/select/default-select"

import { positions } from "api/positions"
import AuthStore from "stores/AuthStore"
import { SelectData } from "typings/Main"

export interface DefaultProps {
    id: "position" | "status"
    name?: string,
    className?: string
    placeholder?: string,
    defaultValue?: string,
    onChange?: (event: React.FormEvent<HTMLSelectElement>) => void
    // items?: SelectData[],
}

export interface DefaultState {
    selectList: SelectData[],
    selected: string
}

export const STATUS_SELECT: SelectData[] = [
    { name: "Pending"},
    { name: "Started"},
    { name: "Finished"}
]

@observer
export default
class Default
extends React.Component<DefaultProps, DefaultState> {

    static defaultProps = {
        type: "text",
        name: "",
        placeholder: "",
        defaultValue: "Select one"
    }

    state = {
        selectList: undefined as SelectData[],
        selected: undefined as string
    }

    positionRequest = positions()


    componentDidMount () {
        if (AuthStore.isLogged && this.props.id == "position") {
            this.positionRequest.run()
                .then((res: SelectData[]) => {
                    this.setState({
                        selectList: res
                    })
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            this.setState({
                selectList: STATUS_SELECT
            })
        }
    }
    
    componentWillUnmount () {
        this.positionRequest.abort()
    }

    handleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.onChange(event)
        this.setState({
            selected: event.currentTarget.value
        })
    }

    render() {
        const { selected, selectList } = this.state
        let { className, id }  = this.props
        return <>
            <div className={`d-input-select ${className}`}>
                <select 
                    id={this.props.name}
                    name={this.props.name}
                    defaultValue={this.props.defaultValue}
                    onChange={this.handleChange} 
                >
                    <option value="">
                        {this.props.placeholder}
                    </option>
                    {!!selectList
                        ? selectList.map((item, i) => {
                            return <option 
                                value={id == "position" ? item.name : item.name.toLowerCase()}
                                key={i}
                            >
                                {item.name}
                            </option>
                        })
                        : <option value="Loading">
                            Loading...
                        </option>
                    }
                </select>
            </div>
        </>
    }
}