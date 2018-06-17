import React from 'react';
import styled from 'styled-components';

const StyledQuestion = styled.div``;

const Question = props => (
  <StyledQuestion>
    <p> {props.value} </p>
    {props.children}
  </StyledQuestion>
);

export default Question;
