import React from 'react';
import styled from 'styled-components';
import Rating from './Rating';

const StyledAnswerEditor = styled.div`
  display: flex;`;

const AnswerEditor = props => (
  <StyledAnswerEditor>
    <Rating />
    <button
      className="answer-save-btn"
      onClick={() => { props.onSave(); }}
    >
        Save
    </button>
  </StyledAnswerEditor>
);

export default AnswerEditor;
