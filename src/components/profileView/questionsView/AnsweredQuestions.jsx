import React from 'react';
import Question from './Question';
import QuestionsQuery from './QuestionsQuery';

const AnsweredQuestions = ({ userId }) => {
  const test = 5;

  const onRemoved = questionId => {
    // dosth
  };

  return (
    <QuestionsQuery answered userId={userId}>
      {questions => {
        const test = 5;

        return questions.map(q => (
          <Question
            key={q.id}
            userId={userId}
            question={q}
            viewMode
            onRemoved={onRemoved}
          />
        ));
      }}
    </QuestionsQuery>
  );
};

export default AnsweredQuestions;
