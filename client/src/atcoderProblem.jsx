// atcoderProblem.jsx
import React, { useState } from 'react';
//import axios from 'axios';
import { Stage, Layer, Text } from 'react-konva';

const AtCoderProblemDraw = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);

  const fetchProblem = async () => {
    const res = await fetch(`http://localhost:4000/api/fetch-problem?url=${encodeURIComponent(url)}`);
    const json = await res.json();
    setData(json);
  }
  return (
    <div>
      <h1>AtCoder 問題抽出ツール</h1>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="AtCoder問題のURL"
        style={{ width: '400px' }}
      />
      <button onClick={fetchProblem}>取得</button>

      {data && (
        <div>
          <h2>{data.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: data.statement }} />
          <h3>サンプル</h3>
          {data.samples.map((s, i) => (
            <div key={i}>
              <pre><b>入力:</b> {s.input}</pre>
              <pre><b>出力:</b> {s.output}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AtCoderProblemDraw;