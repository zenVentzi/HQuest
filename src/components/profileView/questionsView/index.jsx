import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import AnsweredQuestions from './AnsweredQuestions';
import UnansweredQuestions from './UnansweredQuestions';

const StyledQuestionsContainer = styled.div`
  margin-top: 1em;
  width: 100%;
`;

const GET_QUESTIONS = gql`
  query questions($userId: ID!, $answered: Boolean!) {
    questions(userId: $userId, answered: $answered) {
      id
      type
      value
      answer @include(if: $answered) {
        value
      }
    }
  }
`;

const QuestionsContainer = props => {
  const vars = { userId: props.userId, answered: props.answered };

  return (
    <StyledQuestionsContainer>
      <Query query={GET_QUESTIONS} variables={vars}>
        {({ loading, error, data: { questions } }) => {
          if (loading) return <div> loading </div>;
          if (error) return <div> {error} </div>;

          const res = props.answered ? (
            <AnsweredQuestions questions={questions} />
          ) : (
            <UnansweredQuestions questions={questions} />
          );

          return res;
        }}
      </Query>
    </StyledQuestionsContainer>
  );
};

export default QuestionsContainer;
