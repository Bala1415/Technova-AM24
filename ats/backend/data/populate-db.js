require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'prodigy_pathways'
};

async function populateDatabase() {
  let connection;
  
  try {
    console.log('Connecting to MySQL database...');
    console.log(`Host: ${dbConfig.host}`);
    console.log(`User: ${dbConfig.user}`);
    console.log(`Database: ${dbConfig.database}`);
    
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database successfully!\n');
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);
    
    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        domain VARCHAR(100) NOT NULL,
        topic VARCHAR(200) NOT NULL,
        difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
        question TEXT NOT NULL,
        options JSON NOT NULL,
        correctAnswer INT NOT NULL,
        explanation TEXT,
        resources JSON,
        tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Check if questions table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM questions');
    
    if (rows[0].count === 0) {
      console.log('Questions table is empty. Importing data from JSON file...');
      
      // Read questions from JSON file
      const questionsPath = path.join(__dirname, 'backend', 'data', 'questions.json');
      const questionsData = JSON.parse(await fs.readFile(questionsPath, 'utf8'));
      
      // Insert questions into database
      for (const question of questionsData) {
        await connection.query(
          'INSERT INTO questions (id, domain, topic, difficulty, question, options, correctAnswer, explanation, resources, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            question.id,
            question.domain,
            question.topic,
            question.difficulty,
            question.question,
            JSON.stringify(question.options),
            question.correctAnswer,
            question.explanation,
            JSON.stringify(question.resources || {}),
            JSON.stringify(question.tags || [])
          ]
        );
      }
      
      console.log(`Imported ${questionsData.length} questions into the database.`);
    } else {
      console.log(`Questions table already has ${rows[0].count} records.`);
    }
    
    // Show sample data
    const [sampleData] = await connection.query('SELECT * FROM questions LIMIT 3');
    console.log('\nSample data from questions table:');
    console.log(JSON.stringify(sampleData, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Check your username and password.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Make sure MySQL server is running.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

populateDatabase().catch(console.error);