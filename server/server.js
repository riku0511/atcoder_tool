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
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    const title = $('.lang-en h1').first().text().trim();
    const statement = $('.lang-en .part:has(h3:contains("Statement"))').html();
    const samples = [];

    $('#task-statement section.sample').each((i, sec) => {
      const input = $(sec).find('pre').first().text();
      const output = $(sec).find('pre').eq(1).text();
      samples.push({ input, output });
    });

    res.json({ title, statement, samples });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse' });
  }
});

app.listen(4000, () => console.log('Server running at http://localhost:4000'));
