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

// テスト用：データを取得して表示
async function testQuery() {
  try {
    const [rows] = await promisePool.query('SELECT * FROM memos'); // memos テーブル
    console.log('取得したデータ:', rows);
  } catch (err) {
    console.error('クエリエラー:', err);
  } finally {
    pool.end(); 
  }
}

testQuery();
//export default promisePool;
