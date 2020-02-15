import {observable, action, computed, toJS} from "mobx"
import { Message, Template, Filters } from "typings/Main"

class MailsSrore {
    @observable messageList: Message[]
    @observable templates: Template[]
    
    @observable
    filters: Filters = {
        query: "",
        dateFrom: undefined as string,
        dateTo: undefined as string
    }

    /**
     * Returns filtered messageList
     * @returns {Message[]}
     */
    @computed
    get filtered(): Message[] {
        return this.messageList.filter((message) => {
            var mailDate = new Date(message.date * 1000)

            var dateFrom = this.filters.dateFrom
            var dateTo = this.filters.dateTo
            
            var isFromMatch = dateFrom
                ? new Date(dateFrom) <= mailDate
                : true

            var isToMatch = dateTo
                ? new Date(dateTo) >= mailDate
                : true

            var isNameMatch = !!message.recipient.match(this.filters.query)
            return isFromMatch && isToMatch && isNameMatch
        })
    }

    /**
     * Set MessageList and TemplateList
     * @param {Message[]} messageList array of existing messages
     * @param {Template[]} templatesList array of existing templates
     */
    @action
    setData = (messageList: Message[], templatesList: Template[]) => {
        this.messageList = messageList
        this.templates = templatesList
    }

    @action
    cleanMessageList = () => {
        this.messageList = undefined as Message[]
    }

    /**
     * Add new Message to existing MessageList
     * @param {Message[]} messages array of adding message(s)
     */
    @action
    addMessage = (messages: Message[]): void => {
        // messages.map(message => this.messageList.unshift(message))
        this.messageList = [...messages, ...toJS(this.messageList)]
    }

    /**
     * Returns if MessageStore is ready or not
     * @returns {boolean | undefined}
     */
    @computed
    get ready(): boolean | void {
        return !!this.templates && !!this.messageList
    }

    /**
     * Add new template to existing templateList
     * @param {Template} data new template
     */
    @action
    addNewTemplate = (data: Template) => {
        this.templates.push(data)
    }

    /**
     * Returns template by it`s ID
     * @param {string} id - current template`s ID
     * @returns current template or undefined
     */
    @action
    getTemplateById = (id: string): Template | void => {
        return this.templates.find(item => item.id == id)
    }

    /**
     * Set filter that search emails
     * @param {string} query searching string
     */
    @action
    setFilterQuery = (query: string) => {
        this.filters.query = query
    }

    /**
     * Set filter that make search from choosing Date
     * @param {string} from Date search from
     */
    @action
    setFilterFrom = (from: string) => {
        this.filters.dateFrom = from
    }

    /**
     * Set filter that make search until choosing Date
     * @param {string} to Date search until
     */
    @action
    setFilterTo = (to: string) => {
        this.filters.dateTo = to
    }

    // @action
    // setFilters = (filters: Partial<Filters>) => {
    //     var { query = "" } = filters
    //     this.filters.dateFrom = filters.dateFrom
    //     this.filters.query = filters.query || ""
    // }
}

export default new MailsSrore()