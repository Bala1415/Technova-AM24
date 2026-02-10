require('dotenv').config();
const mysql = require('mysql2/promise');
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

// Display JSON file data
async function showJsonData() {
    console.log('\n===== JSON FILE DATABASE =====\n');
    
    // Define data file paths
    const QUESTIONS_FILE = path.join(__dirname, 'backend', 'data', 'questions.json');
    const RESULTS_FILE = path.join(__dirname, 'backend', 'data', 'results.json');
    const USERS_FILE = path.join(__dirname, 'backend', 'data', 'users.json');
    
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
}

// Display MySQL data
async function showMySqlData() {
    console.log('\n===== MYSQL DATABASE =====\n');
    
    // MySQL Database Configuration
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'prodigy_pathways',
        charset: 'utf8mb4'
    };
    
    try {
        // Create connection
        console.log('Connecting to MySQL database...');
        console.log(`Host: ${dbConfig.host}`);
        console.log(`User: ${dbConfig.user}`);
        console.log(`Database: ${dbConfig.database}`);
        
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database successfully!');
        
        // Get tables
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\nTables in database:');
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`- ${tableName}`);
        });
        
        // Query each table
        for (const table of tables) {
            const tableName = Object.values(table)[0];
            console.log(`\n--- ${tableName} ---`);
            
            try {
                const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 1`);
                if (rows.length > 0) {
                    console.log(JSON.stringify(rows[0], null, 2));
                } else {
                    console.log(`No records found in ${tableName}`);
                }
            } catch (error) {
                console.error(`Error querying table ${tableName}:`, error.message);
            }
        }
        
        // Close connection
        await connection.end();
        
    } catch (error) {
        console.error('Error connecting to MySQL database:', error.message);
        console.log('Make sure your MySQL server is running and the credentials are correct.');
    }
}

// Main function
async function main() {
    // Show JSON data
    await showJsonData();
    
    // Show MySQL data
    await showMySqlData();
}

// Run the main function
main().catch(error => {
    console.error('Error:', error);
});