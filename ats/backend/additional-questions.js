// Additional Programming Questions - Easy Difficulty
// Add these to your seed-database.js to have more than 5 easy programming questions

const additionalQuestions = [
    {
        domain: 'programming',
        topic: 'Python',
        difficulty: 'easy',
        question: 'Which of the following is the correct way to create a list in Python?',
        options: ['list = {}', 'list = []', 'list = ()', 'list = <>'],
        correctAnswer: 1,
        explanation: 'In Python, lists are created using square brackets [], dictionaries use {}, tuples use ().',
        resources: {
            youtube: 'https://www.youtube.com/results?search_query=python+lists+tutorial',
            website: 'https://www.w3schools.com/python/python_lists.asp',
            course: 'https://www.codecademy.com/learn/learn-python-3'
        },
        tags: ['python', 'lists', 'data-structures']
    },
    {
        domain: 'programming',
        topic: 'Java',
        difficulty: 'easy',
        question: 'What is the correct way to declare a variable in Java?',
        options: ['var x = 5;', 'int x = 5;', 'x = 5;', 'declare int x = 5;'],
        correctAnswer: 1,
        explanation: 'In Java, variables must be declared with their data type, such as int x = 5; for integers.',
        resources: {
            youtube: 'https://www.youtube.com/results?search_query=java+variables+tutorial',
            website: 'https://www.w3schools.com/java/java_variables.asp',
            course: 'https://www.codecademy.com/learn/learn-java'
        },
        tags: ['java', 'variables', 'syntax']
    },
    {
        domain: 'programming',
        topic: 'Git',
        difficulty: 'easy',
        question: 'Which command is used to initialize a new Git repository?',
        options: ['git start', 'git init', 'git create', 'git new'],
        correctAnswer: 1,
        explanation: 'The git init command is used to create a new Git repository in the current directory.',
        resources: {
            youtube: 'https://www.youtube.com/results?search_query=git+init+tutorial',
            website: 'https://git-scm.com/docs/git-init',
            course: 'https://www.udemy.com/course/git-complete/'
        },
        tags: ['git', 'version-control', 'initialization']
    },
    {
        domain: 'programming',
        topic: 'SQL',
        difficulty: 'easy',
        question: 'Which SQL statement is used to retrieve data from a database?',
        options: ['GET', 'SELECT', 'RETRIEVE', 'FETCH'],
        correctAnswer: 1,
        explanation: 'The SELECT statement is used to query and retrieve data from database tables.',
        resources: {
            youtube: 'https://www.youtube.com/results?search_query=sql+select+tutorial',
            website: 'https://www.w3schools.com/sql/sql_select.asp',
            course: 'https://www.codecademy.com/learn/learn-sql'
        },
        tags: ['sql', 'database', 'query']
    },
    {
        domain: 'programming',
        topic: 'React',
        difficulty: 'easy',
        question: 'What is JSX in React?',
        options: ['A database library', 'A syntax extension for JavaScript', 'A CSS framework', 'A testing tool'],
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like syntax in React components.',
        resources: {
            youtube: 'https://www.youtube.com/results?search_query=react+jsx+tutorial',
            website: 'https://reactjs.org/docs/introducing-jsx.html',
            course: 'https://www.codecademy.com/learn/react-101'
        },
        tags: ['react', 'jsx', 'javascript']
    }
];

module.exports = additionalQuestions;