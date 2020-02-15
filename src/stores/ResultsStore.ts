import { observable, action, computed, reaction, toJS } from "mobx"
import { ResultsData, Position, DefaultFilters, CandidateData } from "typings/Main"
import { filter } from "api/filter/filter"
import AuthStore from "./AuthStore"

class ResultsStore {
	defaultFilters: DefaultFilters = {
		s: "",
		position: undefined as string,
		from_date: undefined as number,
		to_date: undefined as number,
		from_result: 0,
		to_result: 100,
		source: undefined as string,
		status: undefined as string
	}

	isFetching: boolean = false
	isUpload: boolean = false
	limit: number = 15

	@observable results: CandidateData[]
	@observable positions: Position[]
	@observable filters: DefaultFilters = this.defaultFilters
	@observable offset: number = 0
	@observable total_candidates: number

	@computed
	get ready(): boolean {
		var isReady = !!this.results
		if (!isReady && !this.isFetching){
			this.fetch()
		}
		return isReady
	}

	fetch = (): Promise<any> => {
		if (AuthStore.isLogged){
			return new Promise((resolve, reject) => {
				this.isFetching = true

				var request = filter()
	
				request.run({
						limit:this.limit, 
						offset: this.offset,  
						...this.filters
					})
					.then((res: ResultsData) => {
						this.isFetching = false
						this.results 
							? this.results = [
								...this.results,
								...res.candidates
							]
							: this.results = res.candidates
						this.total_candidates = res.count
						resolve()
					})
					.catch(err => {
						reject(err)
						this.isFetching = false
					})
			})
		}
	}
	
	paggination = reaction(
		() => this.offset,
		() => this.fetch()
	)

	filterResults = reaction(
		() => {
			return Object.keys(toJS(this.filters))
				.map(key => {
					return this.filters[key]
				}).join(",")
		},
		() => this.clearResults()
	)

	/**
	 * Set query (s) for searching by name, email, phone
	 * @param {string} query
	 */
	@action
	setFilterQuery = (query: string) => {
		this.filters.s = query
	}

	/**
	 * Set filter that search position
	 * @param {string} position
	 */
	@action
	setFilterPosition = (position: string) => {
		this.filters.position = position
	}
	
	/**
	 * Set filter that make search from choosing Date
	 * @param {number} from_date
	 */
	@action
	setDateFrom = (from_date: number) => {
		this.filters.from_date = from_date
	}

	/**
	 * Set filter that make search until choosing Date
	 * @param {number} to_date
	 */
	@action
	setDateTo = (to_date: number) => {
		this.filters.to_date = to_date
	}
	/**
	 * Set filter that make search from choosing score
	 * @param {number} score_from
	 */
	@action
	setResultFrom = (score_from: number) => {
		this.filters.from_result = score_from
	}

	/**
	 * Set filter that make search until choosing score
	 * @param {number} score_to
	 */
	@action
	setResultTo = (score_to: number) => {
		this.filters.to_result = score_to
	}

	/**
	 * Set filter that make search by source
	 * @param {string} source
	 */
	@action
	setSource = (source: string) => {
		this.filters.source = source
	}
	
	/**
	 * Set filter that make search by status
	 * @param {string} status
	 */
	@action
	setStatus = (status: string) => {
		this.filters.status = status
	}

	/**
	 * @param {number} offset
	 */
	@action
	setOffset = () => {
		this.offset += this.limit
	}

	/**
     * Set a list of results to the store
     * @param {CandidateData} data
     */
	@action
	setResults = (data: CandidateData[]) => {
		this.results = data
	}

	/**
	 * Clear results
	 */
	@action
	clearResults = () => {
		this.results = undefined as CandidateData[]
		this.offset = 0
	}

	@action
	setDefaultFilters = () => {
		this.filters = this.defaultFilters
	}
}

export default new ResultsStore()