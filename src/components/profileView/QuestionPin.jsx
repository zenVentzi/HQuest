import React from 'react';
import { Query } from 'react-apollo';
import { GET_ANSWERED_QUESTION } from 'Queries';
import AnsweredQuestion from './questions/AnsweredQuestion';

const QuestionPin = ({
  match: {
    params: { id: userId, questionId },
  },
  editable,
}) => {
  const vars = { userId, questionId };

  // return <div>comment pin</div>;

  return (
    <Query query={GET_ANSWERED_QUESTION} variables={vars}>
      {({ loading, error, data: { answeredQuestion: q } }) => {
        if (loading) {
          return <div>Loading question..</div>;
        } else if (error) {
          return <div>{error}</div>;
        }

        return (
          <AnsweredQuestion showComments editable={editable} question={q} />
        );
      }}
    </Query>
  );
};

export default QuestionPin;
