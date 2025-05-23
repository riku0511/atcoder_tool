// src/main.jsx
import React, { useState,useRef } from 'react';
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
  const stageRef = useRef(null);

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


  const handleEditText = (shape, id, isRect) => {
    const container = stageRef.current.container();
    const shapeNode = document.querySelector(`#text-${isRect ? 'rect' : 'circle'}-${id}`);
    const textNode = shapeNode.getBoundingClientRect();
    const stageBox = container.getBoundingClientRect();

    const areaPosition = {
      x: stageBox.left + textNode.left - stageBox.left,
      y: stageBox.top + textNode.top - stageBox.top,
    };

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = shape.text;
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width}px`;
    textarea.style.height = `${textNode.height}px`;
    textarea.style.fontSize = '18px';
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = '1';
    textarea.style.fontFamily = 'Calibri';
    textarea.style.textAlign = 'center';
    textarea.style.color = 'black';
    textarea.style.zIndex = 1000;

    textarea.focus();

    const removeTextarea = () => {
      document.body.removeChild(textarea);
    };

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (isRect) {
          setRects(rects.map(r => r.id === id ? { ...r, text: textarea.value } : r));
        } else {
          setCircle(circle.map(c => c.id === id ? { ...c, text: textarea.value } : c));
        }
        removeTextarea();
      }
    });

    textarea.addEventListener('blur', () => {
      if (isRect) {
        setRects(rects.map(r => r.id === id ? { ...r, text: textarea.value } : r));
      } else {
        setCircle(circle.map(c => c.id === id ? { ...c, text: textarea.value } : c));
      }
      removeTextarea();
    });
  };


  return (
    <div>
      <button onClick={handleAddRect}>■を追加</button>
      <button onClick={handleAddCircle}>●を追加</button>
      <Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        // 「node => stageRef.current = node.getStage()」で正しい refs を設定
        ref={node => {
          stageRef.current = node?.getStage() || null;
        }}
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
              onDblClick={() => handleEditText(r, r.id, true)}
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
              onDblClick={() => handleEditText(r, r.id, false)}
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
                offsetY={-2}
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
