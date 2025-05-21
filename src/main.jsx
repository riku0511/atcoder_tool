// src/main.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Stage,Layer,Rect,Circle } from 'react-konva';
import './index.css';

const STAGE_WIDTH = 2100;
const STAGE_HEIGHT = 600;

// 図形の描画範囲制限
const createDragBoundRect = (shapeWidth, shapeHeight) => {
  return (pos) => {
    const x = Math.max(0, Math.min(pos.x, STAGE_WIDTH - shapeWidth));
    const y = Math.max(0, Math.min(pos.y, STAGE_HEIGHT - shapeHeight));
    return { x, y };
  };
};
const createDragBoundCircle = (shapeWidth, shapeHeight) => {
  return (pos) => {
    const x = Math.max(shapeWidth, Math.min(pos.x, STAGE_WIDTH - shapeWidth));
    const y = Math.max(shapeHeight, Math.min(pos.y, STAGE_HEIGHT - shapeHeight));
    return { x, y };
  };
};


const Draw = () => {
  const [rectangles, setRectangles] = useState([]);
  const [circleangles, setCircleangles] = useState([]);

    const handleAddRect = () => {
    const newRect = {
      id: rectangles.length,
      x:  50 + rectangles.length * 120,
      y: 50,
      width: 100,
      height: 100,
      fill: 'skyblue',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
      
    };
    setRectangles([...rectangles, newRect]);
  };

  const handleAddCircle = () => {
    const newCircle = {
      id: circleangles.length,
      x:  50 + circleangles.length * 120,
      y: 150,
      radius:50,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
    };
    setCircleangles([...circleangles, newCircle]);
  };

  return (
    <div>
      <button onClick={handleAddRect}>■を追加</button>
      <button onClick={handleAddCircle}>●を追加</button>
      <Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        pixelRatio={1}
        className="stage-container"
      >
        <Layer>
          {rectangles.map((rect) => (
            <Rect key={rect.id} {...rect}
            dragBoundFunc={createDragBoundRect(rect.width, rect.height)}
            />
          ))}
          {circleangles.map((circle) => (
            <Circle
            key={circle.id} {...circle}
            dragBoundFunc={createDragBoundCircle(circle.radius , circle.radius)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Draw />);
