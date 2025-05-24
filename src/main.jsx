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
  //状態管理
  const [rects, setRects] = useState([]);
  const [circle, setCircle] = useState([]);
  //Konva.Stage の参照
  const stageRef = useRef(null);
    //四角追加
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
  //円追加
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

  //テキスト編集
  const handleEditText = (id, isRect) => {
    // Konva Text ノードを取得
    const selector = isRect ? `.text-rect-${id}` : `.text-circle-${id}`;
    const textNode = stageRef.current.findOne(selector);
    if (!textNode) return;
    // ステージ上の絶対座標
    const absPos = textNode.getAbsolutePosition();
    // ステージ container の位置
    const stageBox = stageRef.current.container().getBoundingClientRect();
    // ページ上のテキスト位置
    const areaPosition = {
      x: stageBox.left + absPos.x,
      y: stageBox.top + absPos.y,
    };
    // テキストサイズ
    const width = textNode.width();
    const height = textNode.height();

    // textarea を作成
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.value = textNode.text();
    // スタイル
    Object.assign(textarea.style, {
      position: 'absolute',
      top: `${areaPosition.y}px`,
      left: `${areaPosition.x}px`,
      width: `${width}px`,
      height: `${height}px`,
      fontSize: `${textNode.fontSize()}px`,
      border: 'none', padding: '0', margin: '0',
      overflow: 'hidden', background: 'none', outline: 'none',
      resize: 'none', lineHeight: textNode.lineHeight(),
      fontFamily: textNode.fontFamily(), textAlign: textNode.align(),
      color: textNode.fill(), zIndex: 1000,
    });
    textarea.focus();

    const remove = () => {
      if (textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    };
    // Enter で確定
    textarea.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const value = textarea.value;
        if (isRect) {
          setRects(rects.map(r => r.id === id ? { ...r, text: value } : r));
        } else {
          setCircle(circle.map(c => c.id === id ? { ...c, text: value } : c));
        }
        remove();
        // リスナ解除
        textarea.removeEventListener('keydown', handleKeyDown);
        textarea.removeEventListener('blur', handleBlur);
      }
    });
    // blurイベント
    const handleBlur = () => {
      const value = textarea.value;
      if (isRect) {
        setRects(rects.map(r => r.id === id ? { ...r, text: value } : r));
      } else {
        setCircles(circles.map(c => c.id === id ? { ...c, text: value } : c));
      }
      removeTextarea();
      textarea.removeEventListener('keydown', handleKeyDown);
      textarea.removeEventListener('blur', handleBlur);
    };

    textarea.addEventListener('keydown', handleKeyDown);
    textarea.addEventListener('blur', handleBlur);
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
              onDblClick={() => handleEditText(r.id, true)}
            >
              <Rect
                width={r.width}
                height={r.height}
                fill={r.fill}
                stroke={r.stroke}
                strokeWidth={r.strokeWidth}
              />
              <Text
                name={`text-rect-${r.id}`}
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
          
          {circle.map(c => (
            <Group
              key={c.id}
              x={c.x}
              y={c.y}
              draggable
              dragBoundFunc={createDragBoundCircle(c.radius, c.radius)}
              onDblClick={() => handleEditText(c.id, false)}
            >
              <Circle
                radius={c.radius}
                fill={c.fill}
                stroke={c.stroke}
                strokeWidth={c.strokeWidth}
                x={0}
                y={0}
              />
              <Text
                name={`text-circle-${c.id}`}
                text={c.text}
                fontSize={18}
                fill="black"
                width={c.radius*2}
                height={c.radius*2}
                align="center"
                verticalAlign="middle"
                x={-c.radius}
                y={-c.radius}
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
