const mysql = require('mysql2/promise');

const commonPasswords = [
    '',
    'root',
    'mysql',
    'password',
    '1234',
    '12345',
    'admin',
    'ProdigyPathways',
    'prodigy'
];

async function testConnection() {
    console.log("Testing database connections...");
    
    for (const password of commonPasswords) {
        try {
            console.log(`Trying user: 'root' with password: '${password}' ...`);
            const connection = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: password,
                database: 'prodigy_pathways' 
            });
            console.log(`\n✅ SUCCESS! The correct password is: '${password}'`);
            console.log(`Please update your .env file with this password.`);
            await connection.end();
            process.exit(0);
        } catch (error) {
            if (error.code === 'ER_ACCESS_DENIED_ERROR') {
                // Wrong password, continue
            } else if (error.code === 'ER_BAD_DB_ERROR') {
                console.log(`\n✅ SUCCESS (Partial)! Password '${password}' is correct, but database 'prodigy_pathways' does not exist yet.`);
                 process.exit(0);
            } else {
                console.log(`Error with password '${password}':`, error.message);
            }
        }
    }
    
    console.log("\n❌ Could not connect with any common password.");
    console.log("You might have set a custom password during installation.");
}

testConnection();
