import React from 'react';
import CompleteQuestion from './CompleteQuestion';
import QuestionsQuery from './QuestionsQuery';

const AnsweredQuestions = ({ userId }) => {
  const test = 5;

  return (
    <QuestionsQuery answered userId={userId}>
      {questions => {
        const test = 5;

        return questions.map(q => (
          <CompleteQuestion key={q.id} userId={userId} question={q} />
        ));
      }}
    </QuestionsQuery>
  );
};

export default AnsweredQuestions;
