import { observable, action, computed, IObservableArray, toJS } from "mobx"
import { DataPosition, Position } from "typings/Main"

class PositionsStore {
    @observable
    positions: DataPosition[]

    /**
     * Writes a list of positions to the store
     * @param data List questions
     */
    @action
    setPositions = (positionsArr: DataPosition[]) => {
        this.positions = positionsArr
    }

    /**
     * Searches position by id
     * @param {string} id - Poisition id
     * @returns Position instance
     */
    @action
    getPositionById = (positionId: string): DataPosition | void => {
        return this.positions.find(position => {
            return position.id == positionId
        }) 
    }

    /**
     * Concat current position list with the new position instance
     * @param data Position instance
     */
    @action
    addPosition = (data: DataPosition) => {
        this.positions.push(data)
    }

    /**
     * Searches for a mutable element by id in and replace with a changed one
     * @param data - Changed position
     */
    @action
    editPosition = (data: DataPosition) => {
        let position = this.positions.find(el => {
            return data.id == el.id
        })
        let positionIndex = this.positions.indexOf(position)
        
        if(positionIndex >= 0)
            this.positions.splice(positionIndex, 1, data)
    }

    /**
     * Delete position
     * @param positionId - Id position
     */
    @action
    removePosition = (positionId: string) => {
        if(this.positions)
            var currentPosition = this.getPositionById(positionId)
        if(currentPosition)
            (this.positions as IObservableArray<DataPosition>).remove(currentPosition)
    }

    /**
     * Concat current type list with the new type 
     * @param positionId Id position 
     * @param type New type
     */
    @action
    addType = (positionId: string, type: string) => {
        if(this.positions)
            var position = this.getPositionById(positionId)
        if(position) {
            // var isType = position.quizzes.includes(type)
            position.quizzes.push(type)
        }
    }

    /**
     * Delete type
     * @param positionId - Id position
     * @type - Delete type
     */
    @action
    removeType = (positionId: string, type: string) => {
        if(this.positions)
            var position = this.getPositionById(positionId)
        if(position)
            var typeIndex = position.quizzes.indexOf(type)
        if(typeIndex >= 0 && position)
            position.quizzes.splice(typeIndex, 1)
    }

}

export default new PositionsStore()