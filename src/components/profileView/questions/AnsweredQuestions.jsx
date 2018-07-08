import React from 'react';
import CompleteQuestion from './CompleteQuestion';

const AnsweredQuestions = ({ showButtons, questions, ...style }) => {
  const test = 5;

  return (
    <div style={style}>
      {questions.map(q => (
        <CompleteQuestion key={q.id} showButtons={showButtons} question={q} />
      ))}
    </div>
  );
};

export default AnsweredQuestions;
