import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Question from './Question';
import CompletedAnswer from './Answer/Completed';

const AnsweredQuestions = props => {
  const renderQuestions = questions => {
    const qComponents = questions.map(q => (
      <Question key={q.id} value={q.value}>
        <CompletedAnswer value={q.answer.value} type={q.type} />
      </Question>
    ));

    return qComponents;
  };

  return renderQuestions(props.questions);
};

export default AnsweredQuestions;
