import React from 'react';
import styled from 'styled-components';
import Answer from './Answer';

const StyledQuestion = styled.div``;

const Question = props => (
  <StyledQuestion>
    <span>Is this is this is is this or how much? </span>
    <br />
    <Answer questionId={props.questionId} />
  </StyledQuestion>
);

export default Question;
