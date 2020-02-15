import React from "react"
import { CandidateData} from "typings/Main"

export interface ResultsDateProps {
    item: CandidateData
}

export interface ResultsDateState {}

export default
class ResultsDate
extends React.Component<ResultsDateProps, ResultsDateState> {
	registerDate = (item: CandidateData) => {
		let time = item.registration_time
		return time
			? time._formatDate("YMD")
			: "none"
	}

    currentDate = (item: CandidateData) => {
        let time = item.candidate_quizzes[0].start_time
        if(time)
            return time._formatDate("YMD")
        else
            return "none"
    }

    startTime = (item: CandidateData) => {
        let time = item.candidate_quizzes[0].start_time
        if(time)
            return time._formatDate("HMS")
        else
            return "none"
    }

    finishTime = (item: CandidateData) => {
        let time = item.candidate_quizzes[0].finish_time
        if(time)
            return time._formatDate("HMS")
        else
            return "none"
    }

    render() {
        let { item } = this.props
        const CurrentDate = this.currentDate(item)
        const StartTime = this.startTime(item)
        const FinishTime = this.finishTime(item)
        return <>
			<p>
				<span>Registered: </span>
				{this.registerDate(item)}
			</p>
            <p>
                <span>Started: </span>
                {CurrentDate}
            </p>
            <p>
                <span>Start time: </span>
                {StartTime}
            </p>
            <p>
                <span>Finish time: </span>
                {FinishTime < StartTime 
                    ? "none"
                    : FinishTime
                }
            </p>
        </>
    }
}