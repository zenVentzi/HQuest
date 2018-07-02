import React from 'react';
import QuestionEditor from './QuestionEditor';

const UnansweredQuestions = ({ questions }) => {
  if (!questions.length) {
    return <div> Congrats. All questions are answered </div>;
  }

  const q = questions[0];
  return <QuestionEditor question={q} />;
};

export default UnansweredQuestions;
