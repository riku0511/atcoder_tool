// src/main.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Stage,Layer,Group,Rect,Circle,Text } from 'react-konva';
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
  const [rects, setRects] = useState([]);
  const [circle, setCircle] = useState([]);

    const handleAddRect = () => {
    const id = rects.length;
    const newRect = {
      id,
      x:  50 + rects.length * 120,
      y: 50,
      width: 100,
      height: 100,
      fill: 'skyblue',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
      text:`${id}`,
    };
    setRects([...rects, newRect]);
  };

  const handleAddCircle = () => {
    const id = circle.length;
    const newCircle = {
      id,
      x:  50 + circle.length * 120,
      y: 150,
      radius:50,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
      text:`${id}`,
    };
    setCircle([...circle, newCircle]);
  };

  // クリックでテキスト編集
  const handleEditTextRect = (id) => {
    const old = rects.find(r => r.id === id);
    const value = window.prompt('新しいテキストを入力してください', old.text);
    if (value != null) {
      setRects(rects.map(r =>
        r.id === id
          ? { ...r, text: value }
          : r
      ));
    }
  };

  const handleEditTextCircle = (id) => {
    const old = circle.find(r => r.id === id);
    const value = window.prompt('新しいテキストを入力してください', old.text);
    if (value != null) {
      setCircle(circle.map(r =>
        r.id === id
          ? { ...r, text: value }
          : r
      ));
    }
  };

  return (
    <div>
      <button onClick={handleAddRect}>■を追加</button>
      <button onClick={handleAddCircle}>●を追加</button>
      <Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        
        className="stage-container"
      >
        <Layer>
          {rects.map(r => (
            <Group
              key={r.id}
              x={r.x}
              y={r.y}
              draggable
              dragBoundFunc={createDragBoundRect(r.width, r.height)}
              onClick={() => handleEditTextRect(r.id)}
            >
              <Rect
                width={r.width}
                height={r.height}
                fill={r.fill}
                stroke={r.stroke}
                strokeWidth={r.strokeWidth}
              />
              <Text
                text={r.text}
                fontSize={18}
                fill="black"
                width={r.width}
                height={r.height}
                align="center"
                verticalAlign="middle"
              />
            </Group>
          ))}
          
          {circle.map(r => (
            <Group
              key={r.id}
              x={r.x}
              y={r.y}
              draggable
              dragBoundFunc={createDragBoundCircle(r.radius, r.radius)}
              onClick={() => handleEditTextCircle(r.id)}
            >
              <Circle
                radius={r.radius}
                fill={r.fill}
                stroke={r.stroke}
                strokeWidth={r.strokeWidth}
                x={0}
                y={0}
              />
              <Text
                text={r.text}
                fontSize={18}
                fill="black"
                width={r.radius*2}
                height={r.radius*2}
                align="center"
                verticalAlign="middle"
                x={-r.radius}
                y={-r.radius}
              />
            </Group>
          ))}
          
        </Layer>
      </Stage>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Draw />);
