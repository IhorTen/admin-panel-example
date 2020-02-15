import { Quiz } from '../typings/Main';
import { observable, computed, action, IObservableArray } from "mobx"
import { TestData, NewData } from "typings/Main"

class TestsStore {
    @observable quizzes: Quiz[]
    @observable checkedRows: string[] = []

    /**
     * Number of item selected
     * @returns {number}
     */
    @computed
    get count(): number {
        return this.checkedRows.length
    }

    /**
     * True if nothing checked
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
        return this.quizzes &&
            this.quizzes.length == this.count
    }

    /**
     * Writes a list of quizzes to the store
     * @param data List tests
     */
    @action
    setTestList = (data: Quiz[]) => {
        this.quizzes = data
    }

    /**
     * Concat current quizzes list with the new 
     * @param newQuizzes List created new quizzes
     */
    @action
    addQuizzes = (newQuizzes: Quiz[]) => {
        this.quizzes = this.quizzes.concat(newQuizzes)
    }
    
    /**
     * Searches for a mutable element by id in and replace with a changed one
     * @param data - Changed quiz
     */
    @action
    editQuiz = (data: Quiz) => {
        let quiz = this.quizzes.find(quiz => {
            return quiz.id == data.id
        })
        let quizIndex = this.quizzes.indexOf(quiz)

        this.quizzes.splice(quizIndex, 1, data)
    }
    
    /**
     * Searches quiz by id
     * @param {string} id - Quiz id
     * @returns Quiz
     */
    getTestById = (id: string): Quiz | void => {
        return this.quizzes.find(element => {
            return element.id == id
        })
    }

    
    // Deletes selected items
    @action
    removeSelected = () => {
        let selectedTests = this.checkedRows
        selectedTests.forEach(element => {
            let quiz = this.getTestById(element)

            if(quiz)
                this.removeTest(quiz)
        })
        this.checkedRows = []
    }

    
    // Unselects all selected items - clear CheckedRows array
    @action
    clearCheckedRows = () => {
        this.checkedRows = []
    }

    /**
     * Delete test
     * @param test - Instance quiz
     */
    @action
    removeTest = (test: Quiz) => {
        (this.quizzes as IObservableArray<Quiz>).remove(test)
    }

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
}

export default new TestsStore()