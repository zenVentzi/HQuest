import React from 'react';
import styled from 'styled-components';
import Rating from './Rating';
import EditorButtons from './EditorButtons';

const StyledAnswerEditor = styled.div``;

const AnswerEditor = props => (
  <StyledAnswerEditor>
    <Rating editMode questionId={props.questionId} />
    <EditorButtons
      questionId={props.questionId}
      onSave={props.onSave}
    />
  </StyledAnswerEditor>
);

export default AnswerEditor;
