const fs = require('fs');
const path = require('path');

// Function to read JSON files
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

// Define data file paths
const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');
const RESULTS_FILE = path.join(__dirname, 'data', 'results.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const COMPREHENSIVE_QUESTIONS_FILE = path.join(__dirname, 'data', 'comprehensive_questions.json');

// Read and display data
console.log('\n===== DATABASE CONTENTS =====\n');

// Questions
const questions = readJsonFile(QUESTIONS_FILE);
console.log(`QUESTIONS (${questions.length} records):`);
console.log(questions.length > 0 ? questions.slice(0, 3) : 'No questions found');
console.log('\n----------------------------\n');

// Results
const results = readJsonFile(RESULTS_FILE);
console.log(`RESULTS (${results.length} records):`);
console.log(results.length > 0 ? results.slice(0, 3) : 'No results found');
console.log('\n----------------------------\n');

// Users
const users = readJsonFile(USERS_FILE);
console.log(`USERS (${users.length} records):`);
console.log(users.length > 0 ? users.slice(0, 3) : 'No users found');
console.log('\n----------------------------\n');

// Comprehensive Questions
const compQuestions = readJsonFile(COMPREHENSIVE_QUESTIONS_FILE);
console.log(`COMPREHENSIVE QUESTIONS (${compQuestions.length} records):`);
console.log(compQuestions.length > 0 ? compQuestions.slice(0, 3) : 'No comprehensive questions found');