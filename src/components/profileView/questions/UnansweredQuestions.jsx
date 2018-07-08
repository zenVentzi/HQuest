import React from 'react';
import QuestionEditor from './QuestionEditor';

const UnansweredQuestions = ({ questions, ...style }) => {
  if (!questions.length) {
    return <div> Congrats. All questions are answered </div>;
  }

  const q = questions[0];
  return (
    <div style={style}>
      <QuestionEditor question={q} />
    </div>
  );
};

export default UnansweredQuestions;
