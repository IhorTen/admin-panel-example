import React from "react"

import ResultsStore from "stores/ResultsStore"
import { ResultsData, CandidateData } from "typings/Main"
import ResultItem from "views/Results/components/ResultItem"

export interface ScrollHandlerProps {
    items: CandidateData[]
}

export interface ScrollHandlerState {
    isUploading: boolean
}

export default
class ScrollHandler
extends React.Component<ScrollHandlerProps, ScrollHandlerState> {
    state = {
        isUploading: true
    }

    componentDidMount() {
        document.addEventListener("scroll", this.handleScroll)
    }
    
    componentWillUnmount() {
        document.removeEventListener("scroll", this.handleScroll)
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.items.length > prevProps.items.length)
            this.setState({isUploading: true})
    }

    handleScroll = () => {
        var { scrollTop, scrollHeight } = document.documentElement
        var { innerHeight } = window
        var { isUploading } = this.state
        
        if (scrollTop > scrollHeight - innerHeight - 100){
            if (isUploading){
                ResultsStore.setOffset()
                this.setState({isUploading: false})
            }
        }    
    }


    render() {
        let { items } = this.props
        
        return <>
            <div>
                {items.map(item => {
                    return <ResultItem
                        key={item._id}
                        item={item}
                    />
                })}
            </div>
        </>
    }
}