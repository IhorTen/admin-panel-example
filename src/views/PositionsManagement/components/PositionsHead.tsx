import React from "react"
import { Link, Route } from "react-router-dom"

import "styles/components/positions/positions-head"

// Components / Views
import Button from "components/Misc/Button"
import CreatePositions from "../views/CreatePositions"

export interface PositionsHeadProps {}

export interface PositionsHeadState {}

export default
class PositionsHead
extends React.Component<PositionsHeadProps, PositionsHeadState> {
    render() {
        return <>
            <div className="positions-head">
                <div className="positions-head-left">
                    <input 
                        type="text"
                        placeholder="search"
                        className="positions-inp-search"
                    />
                </div>
                <div className="positions-head-right">
                    <Link
                        to="/positions/create"
                    >
                        <Button
                            className="mainColor"
                        >
                            Create new positions
                        </Button>
                    </Link>
                </div>
                <Route 
                    path="/positions/create"
                    exact
                    component={CreatePositions}
                />
            </div>
        </>
    }
}