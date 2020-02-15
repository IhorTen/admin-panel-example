
//Results Store
export type Quiz = {
	name: string,
	description: string,
	duration: number,
	type: string,
	id: string
}

export type CandidateAnswersData = {
	question_id?: string,
	variant_id?: string,
	question_content?: string,
	variant_content?: string
}

export type CandidateData = {
	_id: string,
	full_name: string,
	phone: string,
	email: string,
	cv: string
	position: string,
	source?: "solo" | "theadmasters" | "Rabota" | "Dou" | "Work" | "HH",
	work_experience: string
	ip: string,
	registration_time: number,
	candidate_quizzes: QuizzesData[],
}

export type ResultsData = {
	candidates: CandidateData[],
	count?: number
}

export type QuizzesData = {
	quiz_name: string,
	quiz_type?: string,
	score: number,
	start_time: number,
	finish_time?: number,
	status: string,
	candidate_answers?: CandidateAnswersData[]
}

export type Position = {
	name: string
}

//Tests Store
export type TestData = {
    id: string,
    name: string,
    description: string
}

export type CreateQuiz = {
	name: string,
	description: string,
	duration: number,
	font_size?: string
}

export type Quest = {
	question_id: string,
	question_content: string,
	weight: number
}

export type CreateQuestType = {
	question_content: string,
	weight: number
}

export type QuestData = {
	id: string,
	name: string,
	description: string,
	questions: Quest[]
}

export type Variant = {
	variant_id: string ,
	variant_content: string,
	is_answer: boolean
}

export type CreateVariantType = {
	variant_content: string,
	is_answer: boolean | string
}

export type NewData = {
    testName: string,
    description: string
}


//Request
export type LoginReqParams = {
	headers?: any,
	url: string,
    endpoint: string,
    data?: any,
	method: "POST" | "GET" | "PUT" | "DELETE"
}

export type ResTokens = {
	Logged?: boolean, // Delete
	access_token: string,
	refresh_token: string
}

//Postions Store
export type DataPosition = {
	id?: string | number,
	name?: string,
	quizzes?: string[]
}

export type CreatePosition = {
	name: string,
	quizzes: string[]
}

//User Store
export type UserSuccess = {
	// id: string,
	logged_in_as: string,
	// position: string
}

export type User = {
	email: string,
	password: string,
	logged_in_as?: string
}

//Users Store
export type UserData = {
	id: string,
	email: string,
	// position: string
}

//Notifications Store
export type NotificationData = {
	status: string,
	text: string
}

//MailsStore
export type Message = {
	date: number,
	sender: string,
	recipient: string,
	content?: string,
	subject?: string,
	index?: number
}

export type Template = {
	id?: string,
	subject: string,
	content: string
}

export type TempSaveResponse = {
	content: string,
	id: string,
	subject: string
}

export type SendMessage = {
	subject: string,
	content: string, 
	id?: string, 
	recipient: string[] 
}

export type Filters = {
	query: string,
	dateFrom?: string,
	dateTo?: string
}

export type DefaultFilters = {
	s?: string,
	position?: string,
	source?: string,
	from_date?: number,
	to_date?: number,
	from_result?: number,
	to_result?: number,
	status?: string
}

//Types
export type QuizType = {
    name: string
}

export type SelectData = {
    name?: string,
    id?: string
}

