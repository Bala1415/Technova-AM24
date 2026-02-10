import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = Number(process.env.MYSQL_PORT || 3306);
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'prodigy_pathways';

if (!MYSQL_HOST || !MYSQL_USER) {
  throw new Error('Missing MySQL env vars. Required: MYSQL_HOST, MYSQL_USER');
}

// Ensure DB exists
const adminConn = await mysql.createConnection({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD
});
await adminConn.query(
  `CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
);
await adminConn.end();

// Pool
const pool = await mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ensure table exists
await pool.query(`
CREATE TABLE IF NOT EXISTS simple_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  correct INT NOT NULL DEFAULT 0,
  recorrect INT NOT NULL DEFAULT 0,
  login_domain VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (email),
  INDEX (login_domain)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`);

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// POST /api/simple-result
app.post('/api/simple-result', async (req, res) => {
  try {
    const { name, email, correct, recorrect, loginDomain } = req.body;
    if (!name || !email || correct === undefined || recorrect === undefined || !loginDomain) {
      return res.status(400).json({ error: 'Missing fields: name, email, correct, recorrect, loginDomain' });
    }
    await pool.query(
      'INSERT INTO simple_results (name, email, correct, recorrect, login_domain) VALUES (?,?,?,?,?)',
      [name, email, Number(correct), Number(recorrect), loginDomain]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

const port = Number(process.env.SIMPLE_PORT || 4001);
app.listen(port, () => console.log(`Simple API listening on http://localhost:${port}`));


