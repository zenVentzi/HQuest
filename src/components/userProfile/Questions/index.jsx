import React from 'react';
import styled from 'styled-components';
import Question from './Question';

const StyledQuestionsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 40%;`;

const QuestionsContainer = () => (
  <StyledQuestionsContainer>
    <Question />
  </StyledQuestionsContainer>
);

export default QuestionsContainer;
