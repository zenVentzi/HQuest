import React from 'react';
import Rating from './Rating';
import style from './css/answer.css';


const AnswerEditor = props => (
  <div className="answer-edit">
    <Rating />
    <button
      className="answer-save-btn"
      onClick={() => { props.onSave(); }}
    >
        Save
    </button>
  </div>

);

export default AnswerEditor;
