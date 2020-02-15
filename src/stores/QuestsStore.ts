import { Quest } from 'typings/Main'
import { observable, computed, action, IObservableArray } from "mobx"
import { QuestData } from "typings/Main"

class TestStore {
    @observable questList: Quest[]
    @observable checkedRows: string[] = []

    /**
     * Change state/styles checkbox
     * @param event
     * @param {string} id - Id selected element
     */
    @action
    toggleCheck = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        let { checkedRows } = this
        if (!event.currentTarget.checked)
            checkedRows.splice(checkedRows.indexOf(id), 1)
        else
            checkedRows.push(id)
    }

    /**
     * Number of item selected
     * @returns {number}
     */
    @computed
    get count(): number {
        return this.checkedRows.length
    }

    /**
     * If nothing checked
     * @returns {boolean}
     */
    @computed
    get nothingChecked(): boolean {
        return this.count == 0
    }

    /**
     * True if multiple items are selected
     * @returns {boolean}
     */
    @computed
    get someChecked(): boolean {
        return !this.nothingChecked
    }

    /**
     * True if all elements checked
     * @returns {boolean}
     */
    @computed
    get allChecked(): boolean {
        return this.questList &&
            this.questList.length == this.count
    }

    /**
     * Writes a list of questions to the store
     * @param data List questions
     */
    @action
    setQuestList = (data: Quest[]) => {
        this.questList = data
    }

    /**
     * Concat current quizzes list with the new 
     * @param data List created new quizzes
     */
    @action
    addQuestions = (data: Quest[]) => {
        this.questList = this.questList.concat(data)
    }

    /**
     * Searches for a mutable element by id in and replace with a changed one
     * @param data - Changed quiz
     */
    @action
    editQuestion = (data: Quest) => {
        let question = this.questList.find(el => {
            return data.question_id == el.question_id
        })
        let positionIndex = this.questList.indexOf(question)
        
        if(positionIndex >= 0)
            this.questList.splice(positionIndex, 1, data)
    }

    /**
     * Searches question by id
     * @param {string} id - Question id
     * @returns Question
     */
    @action
    getQuestById = (id: string): Quest | void => {
        return this.questList.find((item: Quest) => {
            return id == item.question_id
        })
    }

    /**
     * Delete question
     * @param questId - Id question
     */
    @action
    removeQuest = (questId: string) => {
        if(this.questList)
            var question: Quest | void = this.getQuestById(questId)
        if(question)
            (this.questList as IObservableArray<Quest>).remove(question)
    }

    
    // Deletes selected items
    @action
    removeSelected = () => {
        let selectedQuests = this.checkedRows
        selectedQuests.forEach((el, i) => {
            let quest = this.getQuestById(el)
            if(quest)
                this.removeQuest(this.checkedRows[i])
        })
        this.checkedRows = []
    }

    
    // Unselects all selected items - clear CheckedRows array
    @action
    clearCheckedRows = () => {
        this.checkedRows = []
    }
}

export default new TestStore()