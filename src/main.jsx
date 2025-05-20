// src/main.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Stage,Layer,Rect,Circle } from 'react-konva';
import './index.css';

const App = () => {
  const [rectangles, setRectangles] = useState([]);

  const handleAddRect = () => {
    const newRect = {
      id: rectangles.length,
      x:  50 + rectangles.length * 100,
      y: 60,
      width: 100,
      height: 100,
      fill: 'skyblue',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
    };
    setRectangles([...rectangles, newRect]);
  };

  return (
    <div>
      <button onClick={handleAddRect}>図形を追加</button>
      <Stage
        width={800}
        height={600}
        className="stage-container"
      >
        <Layer>
          {rectangles.map((rect) => (
            <Rect key={rect.id} {...rect} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
