const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'mysql',
    database: process.env.DB_NAME || 'prodigy_pathways',
    charset: 'utf8mb4'
};

const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-env';

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide name, email, and password' });
        }

        // Check if user exists
        const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate UID (simple timestamp based for now, or UUID)
        const uid = 'user_' + Date.now();

        // Insert user
        // Note: We are using the 'uid' column for our persistent ID, and 'id' is auto-increment
        await pool.execute(
            'INSERT INTO users (uid, name, email, password, domain) VALUES (?, ?, ?, ?, ?)',
            [uid, name, email, hashedPassword, role || 'Student'] // Using 'domain' to store role/interest for now if needed, or just default
        );

        // Generate Token
        const token = jwt.sign({ uid: uid, email: email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { uid, name, email, role }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        // Check for user
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Check Password
        // Note: If user was created before we added passwords, they might not have one. 
        // In a real app, we'd handle migration. Here, we assume new flow.
        if (!user.password) {
             return res.status(400).json({ error: 'Please reset your password or register again' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                uid: user.uid,
                name: user.name,
                email: user.email,
                domain: user.domain
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};
