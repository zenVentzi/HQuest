import React from 'react';
import styled from 'styled-components';
import { Transition } from 'react-spring';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import AnsweredQuestions from './AnsweredQuestions';
import UnansweredQuestions from './UnansweredQuestions';

export const GET_QUESTIONS = gql`
  query questions($userId: ID!, $all: Boolean!) {
    questions(userId: $userId, all: $all) {
      answered {
        ...questionFields
        answer {
          id
          value
        }
      }
      unanswered @include(if: $all) {
        ...questionFields
      }
    }
  }

  fragment questionFields on Question {
    id
    question
    type
    possibleAnswers
  }
`;

const StyledQuestionsContainer = styled.div`
  margin-top: 1em;
  width: 100%;
  /* width: 50%; */
  /* border: 3px solid black; */
`;

const QuestionsContainer = ({ user, showAnswered }) => {
  const vars = { userId: user.id, all: user.me };

  return (
    <StyledQuestionsContainer>
      <Query query={GET_QUESTIONS} variables={vars}>
        {({ loading, error, data: { questions } }) => {
          if (loading) return <div> loading questions.. </div>;
          if (error) return <div> {`Error ${error}`}</div>;
          // not using object destructing cuz it didn't work at the time
          const qs = showAnswered ? questions.answered : questions.unanswered;

          return (
            <Transition
              from={{ opacity: 0 }}
              enter={{ opacity: 1 }}
              leave={{ opacity: 0 }}
              questions={qs}
              showButtons={user.me}
            >
              {showAnswered ? AnsweredQuestions : UnansweredQuestions}
            </Transition>
          );
        }}
      </Query>
    </StyledQuestionsContainer>
  );
};

export default QuestionsContainer;
