import React from 'react';
import CompleteQuestion from './CompleteQuestion';

const AnsweredQuestions = ({ questions }) => {
  const test = 5;

  return questions.map(q => <CompleteQuestion key={q.id} question={q} />);
};

export default AnsweredQuestions;
