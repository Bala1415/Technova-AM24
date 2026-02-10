require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const authController = require('./controllers/authController');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
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

// Initialize database tables
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create questions table
        await connection.execute(`
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
        
        // Create quiz_results table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId VARCHAR(255) NOT NULL,
                domain VARCHAR(100) NOT NULL,
                difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
                totalQuestions INT NOT NULL,
                correctAnswers INT NOT NULL,
                score INT NOT NULL,
                percentage DECIMAL(5,2) NOT NULL,
                topics JSON,
                weakAreas JSON,
                timeSpent INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Create users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                uid VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255),
                age INT,
                phone VARCHAR(20),
                domain VARCHAR(100),
                totalQuizzes INT DEFAULT 0,
                averageScore DECIMAL(5,2) DEFAULT 0,
                preferredDifficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
                learningStreak INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        // Create login_events table (to track student logins)
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS login_events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                uid VARCHAR(255) NOT NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_login_events_uid (uid),
                INDEX idx_login_events_login_at (login_at)
            )
        `);
        
        connection.release();
        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}

// Routes

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Prodigy Pathways API Server',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            questions: '/api/questions',
            results: '/api/results',
            users: '/api/users',
            results: '/api/results',
            users: '/api/users',
            login: '/api/auth/login',
            register: '/api/auth/register'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Get questions
app.get('/api/questions', async (req, res) => {
    try {
        const { domain, difficulty, limit = 10 } = req.query;
        
        let query = 'SELECT * FROM questions';
        let params = [];
        let conditions = [];
        
        if (domain) {
            conditions.push('domain = ?');
            params.push(domain);
        }
        
        if (difficulty) {
            conditions.push('difficulty = ?');
            params.push(difficulty);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY RAND() LIMIT ?';
        params.push(limit.toString());
        
        console.log('Executing query:', query);
        console.log('With params:', params);
        const [rows] = await pool.execute(query, params);
        
        // Convert JSON fields back to objects
        const questions = rows.map(row => ({
            ...row,
            options: JSON.parse(row.options),
            resources: row.resources ? JSON.parse(row.resources) : {},
            tags: row.tags ? JSON.parse(row.tags) : []
        }));
        
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Add question
app.post('/api/questions', async (req, res) => {
    try {
        const { domain, topic, difficulty, question, options, correctAnswer, explanation, resources, tags } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO questions (domain, topic, difficulty, question, options, correctAnswer, explanation, resources, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                domain, 
                topic, 
                difficulty, 
                question, 
                JSON.stringify(options), 
                correctAnswer, 
                explanation, 
                JSON.stringify(resources), 
                JSON.stringify(tags)
            ]
        );
        
        res.json({ id: result.insertId, message: 'Question added successfully' });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ error: 'Failed to add question' });
    }
});

// Get all questions (for admin)
app.get('/api/questions/all', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM questions ORDER BY created_at DESC');
        
        const questions = rows.map(row => ({
            ...row,
            options: JSON.parse(row.options),
            resources: row.resources ? JSON.parse(row.resources) : {},
            tags: row.tags ? JSON.parse(row.tags) : []
        }));
        
        res.json(questions);
    } catch (error) {
        console.error('Error fetching all questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Save quiz result
app.post('/api/results', async (req, res) => {
    try {
        const { userId, domain, difficulty, totalQuestions, correctAnswers, score, percentage, topics, weakAreas, timeSpent } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO quiz_results (userId, domain, difficulty, totalQuestions, correctAnswers, score, percentage, topics, weakAreas, timeSpent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, domain, difficulty, totalQuestions, correctAnswers, score, percentage, JSON.stringify(topics), JSON.stringify(weakAreas), timeSpent || 0]
        );
        
        res.json({ id: result.insertId, message: 'Quiz result saved successfully' });
    } catch (error) {
        console.error('Error saving quiz result:', error);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
});

// Get user quiz results
app.get('/api/results/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = req.query.limit || 10;
        
        const [rows] = await pool.execute(
            'SELECT * FROM quiz_results WHERE userId = ? ORDER BY created_at DESC LIMIT ?',
            [userId, parseInt(limit)]
        );
        
        const results = rows.map(row => ({
            ...row,
            topics: row.topics ? JSON.parse(row.topics) : [],
            weakAreas: row.weakAreas ? JSON.parse(row.weakAreas) : []
        }));
        
        res.json(results);
    } catch (error) {
        console.error('Error fetching user results:', error);
        res.status(500).json({ error: 'Failed to fetch user results' });
    }
});

// User management routes
app.post('/api/users', async (req, res) => {
    try {
        const { uid, name, email, age, phone, domain } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO users (uid, name, email, age, phone, domain) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), age = VALUES(age), phone = VALUES(phone), domain = VALUES(domain)',
            [uid, name, email, age, phone, domain]
        );
        
        res.json({ id: result.insertId || 'updated', message: 'User saved successfully' });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Failed to save user' });
    }
});

app.get('/api/users/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        
        const [rows] = await pool.execute('SELECT * FROM users WHERE uid = ?', [uid]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Record a login event for a student (keeping this for legacy/analytics if needed)
app.post('/api/auth/login-event', async (req, res) => {
    try {
        const { uid } = req.body;
        if (!uid) {
            return res.status(400).json({ error: 'uid is required' });
        }

        const forwardedFor = req.headers['x-forwarded-for'];
        const ip = Array.isArray(forwardedFor)
            ? forwardedFor[0]
            : (forwardedFor ? forwardedFor.split(',')[0].trim() : (req.ip || (req.socket && req.socket.remoteAddress) || null));
        const userAgent = req.headers['user-agent'] || null;

        await pool.execute(
            'INSERT INTO login_events (uid, ip_address, user_agent) VALUES (?, ?, ?)',
            [uid, ip, userAgent]
        );

        res.json({ message: 'Login event recorded' });
    } catch (error) {
        console.error('Error recording login event:', error);
        res.status(500).json({ error: 'Failed to record login event' });
    }
});

// Fetch recent login events for a student
app.get('/api/auth/logins/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const limit = parseInt(req.query.limit || '20', 10);
        const [rows] = await pool.execute(
            'SELECT id, uid, ip_address AS ipAddress, user_agent AS userAgent, login_at AS loginAt FROM login_events WHERE uid = ? ORDER BY login_at DESC LIMIT ?',
            [uid, limit]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching login events:', error);
        res.status(500).json({ error: 'Failed to fetch login events' });
    }
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await initializeDatabase();
});