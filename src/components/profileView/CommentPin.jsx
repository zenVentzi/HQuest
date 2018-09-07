import React from 'react';
import { Query } from 'react-apollo';
import { GET_ANSWERED_QUESTION } from 'Queries';
import AnsweredQuestion from './questions/AnsweredQuestion';

const CommentPin = ({ match: { params } }) => {
  const vars = {};

  // return <div>comment pin</div>;

  return (
    <Query query={GET_ANSWERED_QUESTION} variables={vars}>
      {({ loading, error, data: { question } }) => {
        if (loading) {
          return <div>Loading question..</div>;
        } else if (error) {
          return <div>{error}</div>;
        }

        return <AnsweredQuestion question={question} />;
      }}
    </Query>
  );
};

export default CommentPin;
