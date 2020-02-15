import React from "react"

import "styles/components/misc/wysiwyg"

import Button from "./Button"

export interface WYSIWYGProps {
    className?: string,
    defaultValue?: string, // HTML
    type?: "quiz" | "quest",
    addFile: boolean,
    btnClassName?: string,
    onChanged?: (data: string) => void
}

export interface WYSIWYGState {
    value: string,
    fontSize: string
}

export default
class WYSIWYG
extends React.Component<WYSIWYGProps, WYSIWYGState> {
    static defaultProps = {
        className: "",
    }

    private area: HTMLDivElement
    private observer: MutationObserver

    state = {
        value: this.props.defaultValue,
        fontSize: "3"
    }

    get html(): string {
        return this.area
            ? this.area.innerHTML.replace(/\[(https?:\/\/[a-z0-9/\-_.]*)\]\(([^)]*)\)/gi, (match, group1, group2) => {
                return `<a href="${group1}">${group2}</a>`
            })
            : this.props.defaultValue
    }

    componentDidMount() {
        // Add event handler(MutationObserver) on div-contentEditable
        this.observer = new MutationObserver(this.handleChange)
        const config = {
            characterData: true,
            childList: true,
            subtree: true
        } 
        this.observer.observe(this.area, config)
    }

    componentWillUnmount() {
        // Remove event handler(MutationObserver)
        this.observer.disconnect()
    }

    /**
     * Change the font style
     * @param event
     */
    handleClick = (event?: React.MouseEvent<HTMLButtonElement>) => {
        let name = event.currentTarget.name
        switch(name) {
            case "bold":
                document.execCommand( 'bold', null, null )
                break
            case "italic":
                document.execCommand( 'italic', false, null )
                break
        }
    }

    /**
     * Change font size
     * @param event
     */
    changeFontSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let value = event.currentTarget.value
        this.setState({
            fontSize: value
        })
        document.execCommand('fontSize', false, value)
    }

    
    // Writes content div-editable in state
    handleChange = () => {
        this.setState({
            value: this.html
        })
        document.execCommand('fontSize', false, this.state.fontSize)
        if (!!this.props.onChanged)
            this.props.onChanged(this.html)
    }

    handleTextChange = () => {
        // Write default value in state
        this.setState({
            value: this.props.defaultValue
        })
    }

    render() {
        var { className, addFile, defaultValue, btnClassName} = this.props
        return <>
            <div className="wysiwyg-wrap">
                <div className="wysiwyg-head">
                    <div className="wysiwyg-head-left">
                        <Button
                            name="bold"
                            className={`mainColor mr bold ${btnClassName}`}
                            onClick={this.handleClick}
                        >
                            B
                        </Button>
                        <Button
                            name="italic"
                            className={`mainColor mr bold ${btnClassName}`}
                            onClick={this.handleClick}
                        >
                            <i>i</i>
                        </Button>
                        {addFile &&
                            <label htmlFor="download-file" className="download-file">
                                <input type="file" id="download-file"/>
                                Added file
                            </label>
                        }
                        <select 
                            name="font_size" 
                            id="font-size-select"
                            onChange={this.changeFontSize}
                            defaultValue="3"
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                        </select>
                    </div>
                </div>
                <textarea 
                    name="description" 
                    className="wysiwyg-textarea"
                    value={this.state.value}
                    onChange={this.handleTextChange}
                />
                <div
                    className={`wysiwyg-input ${className}`}
                    ref={r => this.area = r}
                    suppressContentEditableWarning
                    contentEditable
                    dangerouslySetInnerHTML={{
                        __html: defaultValue
                    }}
                />
            </div>
        </>
    }
}