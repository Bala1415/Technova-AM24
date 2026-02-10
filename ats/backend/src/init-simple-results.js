import mysql from 'mysql2/promise';

async function main() {
  const host = process.env.MYSQL_HOST || 'localhost';
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'prodigy_pathways';

  const admin = await mysql.createConnection({ host, port, user, password });
  await admin.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await admin.end();

  const conn = await mysql.createConnection({ host, port, user, password, database });
  await conn.query(`
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

  await conn.query(
    'INSERT INTO simple_results (name, email, correct, recorrect, login_domain) VALUES (?,?,?,?,?)',
    ['Demo User', 'demo@example.com', 7, 2, 'programming']
  );

  const [rows] = await conn.query(
    'SELECT id, name, email, correct, recorrect, login_domain, created_at FROM simple_results ORDER BY id DESC LIMIT 1'
  );
  console.log(rows[0]);
  await conn.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


