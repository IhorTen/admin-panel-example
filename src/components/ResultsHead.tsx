import React from "react"
import { observer } from "mobx-react"
import { DateTimePicker } from "@material-ui/pickers"
import { Input } from "@material-ui/core"

import "styles/components/results/filters-head"

import Button from "./Misc/Button"
// import Input from "components/Forms/Inputs/Default"
import Select from "components/Forms/Select/Default"

import ResultsStore from "stores/ResultsStore"
import { AbortableRequest } from "libs/requests/RequestWrap"
import { ResultsData, SelectData } from "typings/Main"
import { Moment } from "moment"


export interface ResultsHeadProps {
}

export interface ResultsHeadState {
    parsed: boolean,
}

export const WAIT_INTERVAL: number = 700

export const PASRED_SOURCES: string[] = [
    "Rabota",
    "Dou",
    "Work",
    "HH"
]


@observer
export default
class ResultsHead
extends React.Component<ResultsHeadProps, ResultsHeadState> {
    request: AbortableRequest<ResultsData>
    timer: any = null

    state = {
        parsed: false,
    }

    componentWillUnmount() {
		this.abortRequest()
	}
	
	abortRequest = () => {
		this.request &&
			this.request.abort()
	}

    handleClick = () => {
        // Refresh results data and filters
        ResultsStore.clearResults()
        this.abortRequest()
    }

    handleInputsFilters = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let { value, name } = event.currentTarget
        switch(name) {
            case "query":
                clearTimeout(this.timer)
                this.timer = setTimeout(() => ResultsStore.setFilterQuery(value), WAIT_INTERVAL)
                break
            case "from_score":
                clearTimeout(this.timer)
                this.timer = setTimeout(() => ResultsStore.setResultFrom(+value), WAIT_INTERVAL)
                break
            case "to_score":
                clearTimeout(this.timer)
                this.timer = setTimeout(() => ResultsStore.setResultTo(+value), WAIT_INTERVAL)
                break
            case "source":
                clearTimeout(this.timer)
                this.timer = setTimeout(() => ResultsStore.setSource(value), WAIT_INTERVAL)
                break
        }
    }

    handleSelectFilters = (event: React.FormEvent<HTMLSelectElement>) => {
        let { value, name } = event.currentTarget
        switch(name) {
            case "position":
                ResultsStore.setFilterPosition(value || undefined)
                break
            case "status":
                ResultsStore.setStatus(value || undefined)
                break
        }
    }

    handleDateTimeChangeFrom = (date: Moment) => {
        ResultsStore.setDateFrom(date.unix())
    }
    
    handleDateTimeChangeTo = (date: Moment) => {
        ResultsStore.setDateTo(date.unix())
    }

    resetFilterDateFrom = () => {
        ResultsStore.setDateFrom(undefined as number)
    }

    resetFilterDateTo = () => {
        ResultsStore.setDateTo(undefined as number)
    }

    render() {
        var { from_date, to_date } = ResultsStore.filters
        return <>
            <div className="filters-head">
                <div className="filters-head-left">
                    <div className="filters-head-item query_position">
                        <div className="filters-inp-wrap query">
                            <Input
                                type="text"
                                name="query"
                                placeholder="Type name/email/phone"
                                className="filters-input-search"
                                onChange={this.handleInputsFilters}
                            />
                        </div>
                        <div className="filters-inp-wrap position">
                            <Select
                                id="position"
                                className="filters-select"
                                name="position"
                                placeholder="Select position"
                                onChange={this.handleSelectFilters}
                            />
                        </div>
                    </div>
                    <div className="filters-head-item filter_date">
                        <div className="filters-inp-wrap">
                            <span>Date from: </span>
                            <div style={{position: "relative"}}>
                                {from_date
                                    ? <i 
                                        className="fas fa-times"
                                        onClick={this.resetFilterDateFrom}
                                    />
                                    : null
                                }
                                <DateTimePicker
                                    className="date-input date_from"
                                    value={from_date ? new Date(from_date*1000) : null}
                                    ampm={false}
                                    format="ddd DD.MM.YYYY HH:mm"
                                    emptyLabel="Select date from"
                                    onChange={this.handleDateTimeChangeFrom}
                                />
                            </div>
                        </div>
                        <div className="filters-inp-wrap">
                            <span>Date to: </span>
                            <div style={{position: "relative"}}>
                                {to_date
                                    ? <i 
                                        className="fas fa-times"
                                        onClick={this.resetFilterDateTo}
                                    />
                                    : null
                                }
                                <DateTimePicker
                                    className="date-input date_to"
                                    value={to_date ? new Date(to_date*1000) : null}
                                    ampm={false}
                                    format="ddd DD.MM.YYYY HH:mm"
                                    emptyLabel="Select date to"
                                    onChange={this.handleDateTimeChangeTo}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="filters-head-item filter_score">
                        <div className="filters-inp-wrap">
                            <span>Score from: </span>
                            <Input
                                type="number"
                                name="from_score"
                                className="score-input"
                                onChange={this.handleInputsFilters}
                            />
                        </div>
                        <div className="filters-inp-wrap">
                            <span>Score to: </span>
                            <Input
                                type="number"
                                name="to_score"
                                className="score-input"
                                onChange={this.handleInputsFilters}
                            />
                        </div>
                    </div>
                    <div className="filters-head-item source_status">
                        <div className="filters-inp-wrap source">
                            <span>Source: </span>
                            <Input
                                type="text"
                                name="source"
                                className="filters-input-search"
                                placeholder="Type source..."
                                onChange={this.handleInputsFilters}
                            />
                        </div>
                        <div className="filters-inp-wrap status">
                            <span>Status: </span>
                            <Select
                                id="status"
                                name="status"
                                className="filters-select"
                                placeholder="All"
                                onChange={this.handleSelectFilters}
                            >
                            </Select>
                        </div>
                    </div>
                </div>
                <Button
                    className="mainColor refresh"
                    onClick={this.handleClick}
                >
                    <i className="fas fa-sync "/>
                    <span>Refresh</span>
                </Button>
                {ResultsStore.results &&
                    <div className="count">
                        Total candidate(s): <b>{ResultsStore.total_candidates}</b>
                    </div>
                }
            </div>
        </>
    }
}