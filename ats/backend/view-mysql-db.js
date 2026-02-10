require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'prodigy_pathways'
};

async function viewDatabase() {
  let connection;
  
  try {
    console.log('Connecting to MySQL database...');
    console.log(`Host: ${dbConfig.host}`);
    console.log(`User: ${dbConfig.user}`);
    console.log(`Database: ${dbConfig.database}`);
    
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database successfully!\n');
    
    // Get list of tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Available tables:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`- ${tableName}`);
    });
    console.log('');
    
    // Query data from each table
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n=== Data from ${tableName} table ===`);
      
      // Get row count
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      const count = countResult[0].count;
      console.log(`Total rows: ${count}`);
      
      if (count > 0) {
        // Get sample data (first 5 rows)
        const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
        console.log('Sample data:');
        console.log(JSON.stringify(rows, null, 2));
      } else {
        console.log('No data in this table.');
      }
    }
    
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Check your username and password.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Make sure MySQL server is running.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`Database '${dbConfig.database}' does not exist.`);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

// View JSON files as well
function viewJsonFiles() {
  try {
    console.log('\n=== JSON Database Files ===');
    const fs = require('fs');
    const path = require('path');
    
    const jsonFiles = ['questions.json', 'results.json', 'users.json'];
    const dataDir = path.join(__dirname, 'backend', 'data');
    
    jsonFiles.forEach(file => {
      const filePath = path.join(dataDir, file);
      try {
        if (fs.existsSync(filePath)) {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          console.log(`\n--- ${file} ---`);
          console.log(`Total items: ${Array.isArray(data) ? data.length : 'Not an array'}`);
          if (Array.isArray(data) && data.length > 0) {
            console.log('Sample item:');
            console.log(JSON.stringify(data[0], null, 2));
          } else {
            console.log('No data in this file.');
          }
        } else {
          console.log(`\n--- ${file} ---`);
          console.log('File does not exist.');
        }
      } catch (err) {
        console.log(`\n--- ${file} ---`);
        console.log(`Error reading file: ${err.message}`);
      }
    });
  } catch (error) {
    console.error('Error viewing JSON files:', error.message);
  }
}

// Run both functions
async function main() {
  console.log('=== DATABASE VIEWER ===');
  console.log('Viewing both MySQL database and JSON files\n');
  
  await viewDatabase();
  viewJsonFiles();
}

main().catch(console.error);