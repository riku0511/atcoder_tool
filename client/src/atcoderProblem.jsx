// atcoderProblem.jsx
import React, { useState } from 'react';


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
          <div>
            {data.samples.map((s, i) => (
              <div
                key={i}
                className="sample-inout"
                style={{ maxWidth: '200px' }}
              >
                <pre><b>入力{i+1}:</b></pre>
                <pre>{s.input}</pre>
                <pre><b>出力{i+1}:</b></pre>
                <pre>{s.output}</pre>
              </div>))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AtCoderProblemDraw;