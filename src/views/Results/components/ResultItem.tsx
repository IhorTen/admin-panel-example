import React from "react"
import { RouteComponentProps } from "react-router-dom"

import "styles/components/results/result-item"

import ResultsDate from "../../../components/ResultsDate"
import Button from "../../../components/Misc/Button"
import Modal from "components/Modals/Default"
import { CandidateData} from "typings/Main"

export interface ResultItemProps {
    item?: CandidateData
}

export interface ResultItemState {
    parsed: boolean,
    isPsyTestModalOpen: boolean
}

export default
class ResultItem
extends React.Component<ResultItemProps, ResultItemState> {
    state = {
        parsed: false,
        isPsyTestModalOpen: false
    }

    handleModalPsyTest = () => {
        this.setState({
            isPsyTestModalOpen: true
        })
    }

    handleClose = () => {
        this.setState({
            isPsyTestModalOpen: false
        })
    }

    render() {
        let { item } = this.props
        var { parsed, isPsyTestModalOpen } = this.state
        
        return <>
            <div className="result-item">
                <div className="result-item-flex">
                    <div className="user-name w20">
                        {item.full_name}
                        {parsed &&
                            <img src={`static/images/${item.source}.png`} />
                        }
                    </div>
                    <div className="w10 tests_score">
                        <div className="cognitive_test">
                            CT:&nbsp;
                            <b>{item.candidate_quizzes[0].score}</b>
                        </div>
                        <div className="psychological_test">
                            {/* PT:&nbsp; */}
                            <Button
                                className="mainColor ps-t-btn"
                                onClick={this.handleModalPsyTest}
                            >
                                Open
                            </Button>
                        </div>
                    </div>
                    <div className="w20">
                        <span className="result-position">
                            {item.position}
                        </span><br/><br/>
						<strong>Source: </strong> {item.source} <br/>
						<strong>IP: </strong> {item.ip}
                    </div>
                    <div className="result-top-right w25">
                        <div className="top-right-row">
                            <span className="contact-name">Phone: </span>
                            <span>
                                {item.phone}
                            </span>
                        </div>
                        <div className="top-right-row">
                            <span className="contact-name">Email: </span>
                            <span>
                                {item.email}
                            </span>
                        </div>
                        <div className="top-right-row">
                            <span className="contact-name">CV: </span>
                            {item.cv 
                                ? <a href={item.cv}>
                                    <Button className="mainColor download-cv-btn">
                                        Download CV
                                    </Button>
                                </a>
                                : <span>no CV</span>
                            }
                            {/* <a href={item.cv}>
                                <Button className="mainColor download-cv-btn">
                                    Download CV
                                </Button>
                            </a> */}
                        </div>
                    </div>
                    <div className="subinfo-date w25">
                        <ResultsDate item={item} />
                    </div>
                </div>
                {isPsyTestModalOpen
                    ? <Modal
                        onClose={this.handleClose}
                        className="psy-test-modal"
                    >
                        {item.candidate_quizzes[0].candidate_answers.map((item, i) => {
                            return <div 
                                key={i}
                                className="psy-test-container"
                            >   
                                <div 
                                    className="question-content"
                                    dangerouslySetInnerHTML={{
                                        __html: `<span><b>Q:</b>&nbsp;</span>${item.question_content}`
                                    }}
                                />
                                <div 
                                    className="variant-content"
                                    dangerouslySetInnerHTML={{
                                        __html: `<b>A:</b>&nbsp; ${item.variant_content}`
                                    }}
                                />
                            </div>
                        })}
                    </Modal>
                    : null
                }
            </div>
        </>
    }
}