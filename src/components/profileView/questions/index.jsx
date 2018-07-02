import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import AnsweredQuestions from './AnsweredQuestions';
import UnansweredQuestions from './UnansweredQuestions';
import { AnimToggler } from './AnimToggler';

export const GET_QUESTIONS = gql`
  query questions($userId: ID!, $all: Boolean!) {
    questions(userId: $userId, all: $all) {
      answered {
        ...questionFields
        answer {
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
    type
    possibleValues
    value
  }
`;

const StyledQuestionsContainer = styled.div`
  margin-top: 1em;
  width: 100%;
  /* width: 50%; */
  /* border: 3px solid black; */
`;

const AllQuestions = ({
  showAnswered,
  questions: { answered, unanswered },
}) => (
  <AnimToggler showFirst={showAnswered}>
    <AnsweredQuestions questions={answered} />
    <UnansweredQuestions questions={unanswered} />
  </AnimToggler>
);

const QuestionsContainer = ({ user, showAnswered }) => {
  const vars = { userId: user.id, all: user.me };

  return (
    <StyledQuestionsContainer>
      <Query query={GET_QUESTIONS} variables={vars}>
        {({ loading, error, data: { questions } }) => {
          if (loading) return <div> loading questions.. </div>;
          if (error) return <div> `Error ${error}`</div>;

          return user.me ? (
            <AllQuestions questions={questions} showAnswered={showAnswered} />
          ) : (
            <AnsweredQuestions questions={questions.answred} />
          );
        }}
      </Query>
    </StyledQuestionsContainer>
  );
};

export default QuestionsContainer;
