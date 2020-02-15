import React from "react"
import { observer } from "mobx-react"
import { Route } from "react-router-dom"

import "styles/views/positions-management"

//Requsts
import { positions } from "api/positions"

//Components/Views
import PositionsHead from "./components/PositionsHead"
import PositionItem from "./components/PositionItem"
import Spinner from "components/Preloaders/Spinner"
import DeletePosition from "./views/DeletePosition"
import EditPosition from "./views/EditPosition"

//Stores
import PositionsStore from "stores/PositionsStore"

export interface PositionsManagementProps {}

export interface PositionsManagementState {}

@observer
export default
class PositionsManagement
extends React.Component<PositionsManagementProps, PositionsManagementState> {

    request = positions()

    componentDidMount() {
        // Sends a request to the list of positions and writes the result to the PositionsStore
        this.request.run().then((res) => {
            // 
            PositionsStore.setPositions(res)
        }).catch((err) => {
            console.log(err)
        })
    }
    
    componentWillUnmount() {
        // Abort requests on positions list
        this.request.abort()
    }

    render() {
        let { positions } = PositionsStore
        return <>
            <div className="v-positions-management">
                <div className="a-panel-content">
                    <PositionsHead />
                    <div className="positions-list">
                        {!positions
                            ? <Spinner />
                            : positions.map((item, i) => {
                                i++
                                return (
                                    <PositionItem
                                        key={i}
                                        positionItem={item}
                                        styles={{
                                            animationDelay: `${10 * i}ms`
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <Route
                path="/positions/:positionId/delete"
                component={DeletePosition}
            />
            <Route
                path="/positions/:positionId/edit"
                component={EditPosition}
            />
        </>
    }
}