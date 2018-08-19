import React from 'react';
import UnansweredQuestion from './UnansweredQuestion';

const UnansweredQuestions = ({ questions, ...style }) => {
  if (!questions.length) {
    return <div style={style}> Congrats. All questions are answered </div>;
  }

  const q = questions[0];
  return <UnansweredQuestion style={style} question={q} />;
};

export default UnansweredQuestions;
