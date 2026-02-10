require('dotenv').config();
const mysql = require('mysql2/promise');

async function queryDatabase() {
    // MySQL Database Configuration
    const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
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
        
        // Show tables
        console.log('\nTables in database:');
        const [tables] = await connection.query('SHOW TABLES');
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`- ${tableName}`);
        });
        
        // Query questions table
        console.log('\nQuestions (LIMIT 10):');
        try {
            const [rows] = await connection.query('SELECT * FROM questions LIMIT 10');
            console.log(`Found ${rows.length} questions`);
            rows.forEach(row => {
                console.log(`ID: ${row.id}, Domain: ${row.domain}, Topic: ${row.topic}, Question: ${row.question.substring(0, 50)}...`);
            });
        } catch (error) {
            console.log('Error querying questions table:', error.message);
        }
        
        // Close connection
        await connection.end();
        console.log('\nDatabase connection closed');
        
    } catch (error) {
        console.error('Error connecting to MySQL database:', error.message);
        console.log('Make sure your MySQL server is running and the credentials are correct.');
    }
}

// Run the query
queryDatabase().catch(console.error);