import express from 'express';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/fetch-problem', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'url required' });

  try {
    //テキスト状態でhtml読み込み
    const html = await fetch(url).then(r => r.text());
    //DOM変換
    const $ = cheerio.load(html);
    
    const title = $('title').first().text().trim();
    const statement = $('.lang-ja .part:has(h3:contains("問題文"))').html();
    const samples = [];
    let temp = {};

    $('#task-statement .lang-ja .part:has(h3:contains("例")) ').each((index, sec) => {
      const text = $(sec).find('pre').text().trim();
      if (index % 2 === 0) {
        temp.input = text;
      }
      else {
        temp.output = text;
        samples.push({ ...temp });
        temp = {}; 
      }
    });

    res.json({ title, statement, samples });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse' });
  }
});

app.listen(4000, () => console.log('Server running at http://localhost:4000'));
