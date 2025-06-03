// server/db.js
import mysql from 'mysql2';

// データベース接続設定
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'atcoder_memo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

export default promisePool;
