import React, { Fragment } from 'react';
import AnsweredQuestion from './AnsweredQuestion';

const AnsweredQuestions = ({ showButtons, questions, ...style }) => {
  const test = 5;

  return questions.length > 0 ? (
    questions.map(q => (
      <AnsweredQuestion
        key={q.id}
        style={style}
        showButtons={showButtons}
        question={q}
      />
    ))
  ) : (
    <div style={style}> No answered questions </div>
  );
};

export default AnsweredQuestions;
