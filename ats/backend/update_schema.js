require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'prodigy_pathways',
    charset: 'utf8mb4'
};

async function updateSchema() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check if password column exists
        const [columns] = await connection.execute("SHOW COLUMNS FROM users LIKE 'password'");
        
        if (columns.length === 0) {
            console.log('Adding password column to users table...');
            await connection.execute("ALTER TABLE users ADD COLUMN password VARCHAR(255)");
            console.log('✅ Password column added successfully.');
        } else {
            console.log('ℹ️ Password column already exists.');
        }

    } catch (error) {
        console.error('❌ Error updating schema:', error);
    } finally {
        if (connection) await connection.end();
    }
}

updateSchema();
