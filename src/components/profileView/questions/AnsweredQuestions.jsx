import React from 'react';
import CompleteQuestion from './CompleteQuestion';

const AnsweredQuestions = ({ showButtons, questions, ...style }) => {
  const test = 5;

  return (
    <div style={style}>
      {questions.length > 0 ? (
        questions.map(q => (
          <CompleteQuestion key={q.id} showButtons={showButtons} question={q} />
        ))
      ) : (
        <div> No answered questions </div>
      )}
    </div>
  );
};

export default AnsweredQuestions;
