import React from 'react';
import styled, { keyframes } from 'styled-components';
import Answer from './Answer/Answer';

const StyledQuestion = styled.div``;

const Question = ({ question, onSave }) => {
  const answerProps = { type: question.type };

  if (onSave) {
    answerProps.onSave = onSave;
  }

  if (question.answer) {
    answerProps.value = question.answer.value;
  }

  return (
    <StyledQuestion>
      <p> {question.value} </p>
      <Answer {...answerProps} />
    </StyledQuestion>
  );
};

export default Question;
