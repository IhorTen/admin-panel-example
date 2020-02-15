import React from "react"
import { observer } from "mobx-react"

import "styles/views/results"

// Components / Views
import ResultsHead from "components/ResultsHead"
import ScrollHandler from "views/Results/components/ScrollHandler"
import Spinner from "components/Preloaders/Spinner"

// Stores
import ResultsStore from "stores/ResultsStore"

export interface AdminPanelProps {
}

export interface AdminPanelState {
}

@observer
export default
class AdminPanel
extends React.Component<AdminPanelProps, AdminPanelState> {
    
    componentWillUnmount() {
        ResultsStore.clearResults()
        ResultsStore.setDefaultFilters()
    }

    render() {
        let { results } = ResultsStore
            
        return <>
            <main className="v-admin-panel">
                <ResultsHead />
                <div className="a-panel-table">
                    <div className="a-table-head">
                        <p className="table-title w20">
                            Name
                        </p>
                        <p className="table-title w10">
                            Score
                        </p>
                        <p className="table-title w20">
                            Position
                        </p>
                        <p className="table-title w25">
                            Contact
                        </p>
                        <p className="table-title w20">
                            Date time
                        </p>
                    </div>
                    <div className="a-table-body">
                        {!ResultsStore.ready
                            ? <Spinner />
                            : results.length != 0
                                ? <ScrollHandler
                                    items={ResultsStore.results}
                                />
                                : <div style={{textAlign: "center"}}>
                                    No results
                                </div>
                        }
                    </div>
                </div>
            </main>
        </>
    }
}