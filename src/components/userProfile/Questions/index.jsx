import React from 'react';
import styled from 'styled-components';
import Question from './Question';

const StyledQuestionsContainer = styled.div`
  margin-top: 1em;`;

const QuestionsContainer = () => (
  <StyledQuestionsContainer>
    <Question />
  </StyledQuestionsContainer>
);

export default QuestionsContainer;
