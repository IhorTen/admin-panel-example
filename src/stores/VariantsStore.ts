import { observable, action, computed, IObservableArray, toJS } from "mobx"
import { Variant } from 'typings/Main'

class VariantsStore {
    @observable variants: Variant[]
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
        return this.variants &&
            this.variants.length == this.count
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

    /**
     * Writes a list of variants to the store
     * @param data List variants
     */
    @action
    setVariants(data: Variant[]) {
        this.variants = data
    }

    /**
     * Concat current variants list with the new 
     * @param data List created new variants
     */
    @action
    addVariants = (data: Variant[]) => {
        this.variants = this.variants.concat(data)
    }

    /**
     * Searches for a mutable element by id in and replace with a changed one
     * @param data - Changed variant
     */
    @action
    editVariant = (data: Variant) => {
        let variant = this.variants.find(el => {
            return data.variant_id == el.variant_id
        })
        let positionIndex = this.variants.indexOf(variant)
        
        if(positionIndex >= 0)
            this.variants.splice(positionIndex, 1, data)
    }

    /**
     * Searches variant by id
     * @param {string} id - Variant id
     * @returns Variant instans
     */
    @action
    getVariantById = (id: string): Variant /* | void */ => {
        return this.variants.find(item => {
            return id == item.variant_id
        })
    }

    /**
     * Delete variant
     * @param variant - Variant instance
     */
    @action
    removeVariant = (variant: Variant) => {
        (this.variants as IObservableArray<Variant>).remove(variant)
    }

    
    // Deletes selected items
    @action
    removeSelected = () => {
        let selectedAnswers = this.checkedRows
        selectedAnswers.forEach(selectId => {
            let variant = this.getVariantById(selectId)
            if(variant)
                this.removeVariant(variant)
        })
    }
    
    
    // Unselects all selected items - clear CheckedRows array
    @action
    clearCheckedRows = () => {
        this.checkedRows = []
    }
}

export default new VariantsStore()