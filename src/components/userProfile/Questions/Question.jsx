import React from 'react';
import styled from 'styled-components';
import Answer from './Answer';

const StyledQuestion = styled.div`
  padding: initial;
  font-size: 20px;
  text-align: center;  

  margin-top: 10px;`;

const Question = () => (
  <StyledQuestion>
    <i>Is this is this is is this or how much?</i>
    <br />
    <Answer />
  </StyledQuestion>
);

export default Question;
