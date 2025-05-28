// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Draw from './Draw.jsx'
import AtCoderProblemDraw from './atcoderProblem.jsx'

const root_Draw = ReactDOM.createRoot(document.getElementById('root_Draw'));
root_Draw.render(<Draw />);

const root_AtCoderProblemDraw = ReactDOM.createRoot(document.getElementById('root_AtCoderProblemDraw'));
root_AtCoderProblemDraw.render(<AtCoderProblemDraw />);
