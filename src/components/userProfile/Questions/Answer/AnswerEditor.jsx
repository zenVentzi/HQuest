import React from 'react';
import styled from 'styled-components';
import Rating from './Rating';
import ButtonsContainer from './ButtonsContainer';

const StyledAnswerEditor = styled.div``;

const AnswerEditor = props => (
  <StyledAnswerEditor>
    <Rating />
    <ButtonsContainer onSave={props.onSave} />
  </StyledAnswerEditor>
);

export default AnswerEditor;
