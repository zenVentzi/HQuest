import React from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import Question from './Question';
import gql from 'graphql-tag';

const StyledQuestionsContainer = styled.div`
  margin-top: 1em;
`;

const GET_QUESTIONS = gql`
  query questions($userId: ID!) {
    questions(userId: $userId) {
      id
      value
    }
  }
`;

const QuestionsContainer = props => {
  const renderQuestions = () => {
    // = pros.questionIds.map

    const tempIds = [1];
    const questions = tempIds.map(id => <Question key={id} questionId={id} />);

    return questions;
  };

  return (
    <StyledQuestionsContainer>
      <Query query={GET_QUESTIONS} variables={{ userId: props.userId }}>
        {({ loading: loadingQuestions, error: errorQuestions, data: { questions } }) => (
          // <Query
          //   query={GET_ANSWERS}

          // >
          <div> questions </div>
        )}
      </Query>
    </StyledQuestionsContainer>
  );
};

export default QuestionsContainer;
