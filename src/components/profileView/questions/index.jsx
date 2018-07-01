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
  /* width: 50%; */
  /* border: 3px solid black; */
`;

const StyledAnimator = styled.div`
  /* border: 3px solid black; */
  /* width: inherit; */
  border: 3px solid black;
  width: 100%;
`;

const StyledQuestion = styled.div`
  border: 3px solid black;
`;

const QuestionsContainer = ({ userId, showAnswered }) => {
  const test = 5;

  return (
    <StyledQuestionsContainer>
      <AnimToggler showFirst={showAnswered}>
        <AnsweredQuestions userId={userId} />
        <UnansweredQuestions userId={userId} />
      </AnimToggler>
    </StyledQuestionsContainer>
  );
};

export default QuestionsContainer;
