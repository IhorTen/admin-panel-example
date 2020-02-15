import { QuizType } from '../typings/Main';
import { TestData, QuestData, UserData, DataPosition, Position } from "typings/Main"

class MockupData {
    tests: TestData[] = [
        {
            id: "1",
            name: "Test1",
            description: "description1"
        },
        {
            id: "2",
            name: "Test2",
            description: "description2"
        },
        {
            id: "3",
            name: "Test3",
            description: "description3"
        },
        {
            id: "4",
            name: "Test4",
            description: "description4"
        },
        {
            id: "5",
            name: "Test5",
            description: "description5"
        },
    ]

    questions: /*QuestData[]*/ any[] = [
        {
            id: `1`,
            questName: "Question 1",
        },
        {
            id: `2`,
            questName: "Question 2",
        },
        {
            id: `3`,
            questName: "Question 3",
        },
        {
            id: `4`,
            questName: "Question 4",
        },
    ]

    // answers: Variant[] = [
    //     {
    //         variant_id: `${Math.random()}`,
    //         variant_content: "Answer 1",
    //     },
    //     {
    //         variant_id: `${Math.random()}`,
    //         variant_content: "Answer 2",
    //     },
    //     {
    //         variant_id: `${Math.random()}`,
    //         variant_content: "Answer 3",
    //     },
    //     {
    //         variant_id: `${Math.random()}`,
    //         variant_content: "Answer 4",
    //     },
    // ]

    users: UserData[] = [
        {
            id: "1",
            email: "admin@theadmasters.com",
            // position: "Admin",
        },
        {
            id: "2",
            email: "example2@gmail.com",
            // position: "Admin",
        },
        {
            id: "3",
            email: "example3@gmail.com",
            // position: "Admin",
        },
        {
            id: "4",
            email: "example4@gmail.com",
            // position: "Admin",
        },
        {
            id: "5",
            email: "example5@gmail.com",
            // position: "Admin",
        },
        {
            id: "6",
            email: "example6@gmail.com",
            // position: "Admin",
        },
    ]

    positions: Position[] = [
        {
            name: "React Developer",
        },
        {
            name: "Node JS Developer",
        },
    ]

    // mailsList: Mail [] = [
    //     {
    //         id: "111aaa",
    //         date: 1573731158,
    //         sender: 'theadmasters@gmail.com',//sender
    //         recipient: "ihor@gmail.com",//recipient
    //         content: "ihor@gmail.com some text bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "Welcome to dream team"
    //     },
    //     {
    //         id: "222aaa",
    //         date: 1573644758,
    //         sender: 'theadmasters@gmail.com',
    //         recipient: "oleg@gmail.com",
    //         content: "oleg@gmail.com some sdasd ad asd ada sdasd asd aatext bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "Welcome to dream team"
    //     },
    //     {
    //         id: "333aaa",
    //         date: 1573659158,
    //         sender: 'theadmasters@gmail.com',
    //         recipient: "yura@gmail.com",
    //         content: "yura@gmail.com some text bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "Welcome to dream team"
    //     },
    //     {
    //         id: "444aaa",
    //         date: 1573669958,
    //         sender: 'theadmasters@gmail.com',
    //         recipient: "andrey@gmail.com",
    //         content: "andrey@gmail.com some text bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "React test"
    //     },
    //     {
    //         id: "555aaa",
    //         date: 1573583558,
    //         sender: 'theadmasters@gmail.com',
    //         recipient: "stas@gmail.com",
    //         content: "stas@gmail.com some text bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "Node test"
    //     },
    //     {
    //         id: "666aaa",
    //         date: 1573492748,
    //         sender: 'theadmasters@gmail.com',
    //         recipient: "alex@gmail.com",
    //         content: "alex@gmail.com some text bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "Python test"
    //     },
    //     {
    //         id: "777aaa",
    //         date: 1573292551,
    //         sender: 'theadmasters@gmail.com',
    //         recipient: "another@gmail.com",
    //         content: "another@gmail.com some text bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "HTML5/CSS3 test"
    //     },
    //     {
    //         id: "888aaa",
    //         date: 1572394758,
    //         sender: 'theadmasters@gmail.com',
    //         recipient: "ivan@gmail.com",
    //         content: "ivan@gmail.com some text bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "JS test"
    //     },
    //     {
    //         id: "000aaa",
    //         date: 1573194758,
    //         sender: 'theadmasters@gmail.com',
    //         recipient: "pasha@gmail.com",
    //         content: "pasha@gmail.com some text bla bla bla bla bla, blaaa bl blabla b blab bllllaaaaaa",
    //         subject: "Java test"
    //     }
    // ]

    // templates: Template[] =[
    //     {
    //         id: "11qq",
    //         subject: "Template 1",//subject
    //         content: "Here is template content, bla bla bla"
    //     },{
    //         id: "22qq",
    //         subject: "Template 2",
    //         content: "Here is template content, bla bla bla"
    //     },{
    //         id: "33qq",
    //         subject: "Template 3",
    //         content: "Here is template content, bla bla bla"
    //     },{
    //         id: "44qq",
    //         subject: "Template 4",
    //         content: "Here is template content, bla bla bla"
    //     },{
    //         id: "55qq",
    //         subject: "Template 5",
    //         content: "Here is template content, bla bla bla"
    //     },{
    //         id: "66qq",
    //         subject: "Template 6",
    //         content: "Here is template content, bla bla bla"
    //     },
    // ]

    //Types
    types: QuizType[] = [
        {
            name: "React" 
        },{
            name: "Node"
        },{
            name: "Cognitive"
        }
    ]

    // Quizzes types
    quizTypes: string[] = ["React", "Node", "Cognitive"]
}

export default new MockupData()