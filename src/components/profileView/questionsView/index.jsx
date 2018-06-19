import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import AnsweredQuestions from './AnsweredQuestions';
import UnansweredQuestions from './UnansweredQuestions';
import { AnimToggler } from './AnimToggler';

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

const QuestionsContainer = ({ userId, showAnswered }) => {
  const test = 5;

  return (
    <AnimToggler showFirst={showAnswered}>
      <AnsweredQuestions userId={userId} />
      <UnansweredQuestions userId={userId} />
    </AnimToggler>
  );
};

export default QuestionsContainer;
