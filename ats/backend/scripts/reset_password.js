
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mysql',
    database: process.env.DB_NAME || 'prodigy_pathways',
    charset: 'utf8mb4'
};
// Create connection pool
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function resetPassword() {
    // Get command line arguments
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
        console.log('\nUsage: node scripts/reset_password.js <email> <new_password>');
        console.log('Example: node scripts/reset_password.js user@example.com MyNewPass123\n');
        process.exit(1);
    }
    
    try {
        console.log('Connecting to database...');
        
        // Check if user exists
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            console.error(`❌ User with email "${email}" not found.`);
            process.exit(1);
        }

        console.log(`Found user: ${users[0].name} (UID: ${users[0].uid})`);

        // Hash new password
        console.log(' hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await pool.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
        
        console.log(`✅ Password for "${email}" has been successfully updated.`);

    } catch (error) {
        console.error('❌ Error resetting password:', error);
    } finally {
        await pool.end();
    }
}

resetPassword();
