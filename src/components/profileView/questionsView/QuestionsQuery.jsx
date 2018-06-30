import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const GET_QUESTIONS = gql`
  query questions($userId: ID!, $answered: Boolean!) {
    questions(userId: $userId, answered: $answered) {
      id
      type
      possibleValues
      value
      answer @include(if: $answered) {
        value
      }
    }
  }
`;

const QQuery = ({ userId, answered, children }) => {
  const vars = { userId, answered };

  return (
    <Query query={GET_QUESTIONS} variables={vars}>
      {({ loading, error, data: { questions } }) => {
        if (loading) return <div> loading.. </div>;
        if (error) return <div> `Error ${error}`</div>;

        return children(questions);
      }}
    </Query>
  );
};

export default QQuery;
