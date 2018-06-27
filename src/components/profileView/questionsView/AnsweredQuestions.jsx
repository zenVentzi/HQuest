import React from 'react';
import Question from './Question';
import QuestionsQuery from './QuestionsQuery';

const AnsweredQuestions = ({ userId }) => {
  const test = 5;

  return (
    <QuestionsQuery answered userId={userId}>
      {questions =>
        questions.map(q => (
          <Question key={q.id} userId={userId} question={q} viewMode />
        ))
      }
    </QuestionsQuery>
  );
};

export default AnsweredQuestions;
