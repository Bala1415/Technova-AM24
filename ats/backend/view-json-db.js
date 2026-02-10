const fs = require('fs');
const path = require('path');

// Function to read JSON files
function readJsonFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } else {
            console.log(`File not found: ${filePath}`);
            return [];
        }
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

// Define data file paths
const QUESTIONS_FILE = path.join(__dirname, 'backend', 'data', 'questions.json');
const RESULTS_FILE = path.join(__dirname, 'backend', 'data', 'results.json');
const USERS_FILE = path.join(__dirname, 'backend', 'data', 'users.json');

console.log('\n===== JSON FILE DATABASE =====\n');

// Questions
const questions = readJsonFile(QUESTIONS_FILE);
console.log(`QUESTIONS (${questions.length} records):`);
if (questions.length > 0) {
    console.log(JSON.stringify(questions[0], null, 2));
} else {
    console.log('No questions found');
}
console.log('\n----------------------------\n');

// Results
const results = readJsonFile(RESULTS_FILE);
console.log(`RESULTS (${results.length} records):`);
if (results.length > 0) {
    console.log(JSON.stringify(results[0], null, 2));
} else {
    console.log('No results found');
}
console.log('\n----------------------------\n');

// Users
const users = readJsonFile(USERS_FILE);
console.log(`USERS (${users.length} records):`);
if (users.length > 0) {
    console.log(JSON.stringify(users[0], null, 2));
} else {
    console.log('No users found');
}