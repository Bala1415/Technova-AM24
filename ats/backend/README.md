# Prodigy Pathways - Backend Setup Guide

## Prerequisites

1. **Node.js** (version 14 or higher)
   - Download from https://nodejs.org/

2. **MySQL Server** (version 5.7 or higher)
   - Download from https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

## Step 1: Database Setup

### Option A: Using XAMPP/WAMP
1. Start XAMPP/WAMP
2. Start Apache and MySQL services
3. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
4. Create a new database named `prodigy_pathways`

### Option B: Using MySQL directly
1. Start MySQL service
2. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
3. Create database:
   ```sql
   CREATE DATABASE prodigy_pathways CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## Step 2: Backend Server Setup

1. **Navigate to the backend directory:**
   ```bash
   cd D:\srm\backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure database connection:**
   - Open `server.js`
   - Update the database configuration on lines 12-18:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       user: 'root',
       password: 'your_mysql_password_here', // Add your MySQL password
       database: 'prodigy_pathways',
       charset: 'utf8mb4'
   };
   ```

4. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## Step 3: Verify Setup

1. **Check server status:**
   - Open your browser and go to: http://localhost:5000/api/health
   - You should see: `{"status":"OK","message":"Server is running"}`

2. **Check database tables:**
   - The server automatically creates the required tables on startup
   - You should see these tables in your `prodigy_pathways` database:
     - `questions`
     - `quiz_results`
     - `users`

## Step 4: Populate Database with Sample Questions

1. **Open your quiz application in the browser**

2. **Open browser console** (F12 → Console tab)

3. **Run the seeding function:**
   ```javascript
   seedDatabase()
   ```
   
   This will populate your database with sample questions from different domains.

## API Endpoints

Your backend server provides these endpoints:

### Questions
- `GET /api/questions` - Get questions (with domain, difficulty, limit filters)
- `POST /api/questions` - Add a new question
- `GET /api/questions/all` - Get all questions

### Quiz Results
- `POST /api/results` - Save quiz result
- `GET /api/results/:userId` - Get user's quiz results

### Users
- `POST /api/users` - Create/update user
- `GET /api/users/:uid` - Get user by UID

### Health Check
- `GET /api/health` - Check server status

## Troubleshooting

### Common Issues:

1. **"Cannot connect to database"**
   - Make sure MySQL is running
   - Check database credentials in `server.js`
   - Ensure the database `prodigy_pathways` exists

2. **"Port 5000 already in use"**
   - Change the PORT in `server.js` (line 5)
   - Or set environment variable: `set PORT=3001` (Windows) or `export PORT=3001` (Linux/Mac)

3. **"Module not found" errors**
   - Run `npm install` again
   - Make sure you're in the `/backend` directory

4. **CORS errors**
   - The server is configured to allow all origins
   - If issues persist, check your browser console for specific error messages

## Testing the Integration

Once everything is set up:

1. **Start the backend server** (should show "🚀 Server running on http://localhost:5000")
2. **Open your quiz application** in the browser
3. **Register a new user** or **login**
4. **Take a quiz** - results should now be saved to the database instead of localStorage
5. **Check the console** - you should see "✅ Quiz result saved to Firebase successfully" (even though it's using MySQL)

## Database Schema

The backend automatically creates these tables:

```sql
-- Questions table
CREATE TABLE questions (
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
);

-- Quiz results table
CREATE TABLE quiz_results (
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
);

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(20),
    domain VARCHAR(100),
    totalQuizzes INT DEFAULT 0,
    averageScore DECIMAL(5,2) DEFAULT 0,
    preferredDifficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    learningStreak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Production Considerations

For production deployment:
1. Use environment variables for database credentials
2. Add proper error handling and logging
3. Implement authentication and authorization
4. Add rate limiting
5. Use HTTPS
6. Consider using a process manager like PM2