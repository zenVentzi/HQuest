import React from 'react';
import styled from 'styled-components';
import Scale from './Scale';
import StyledBtn from './StyledBtn';

const StyledAnswerEditor = styled.div``;

const SaveBtn = props => (
  <StyledBtn
    onClick={() => {
      props.onSave();
    }}
  >
    Save
  </StyledBtn>
);

const tempVals = [
  'Never',
  'Very Rarely',
  'Rarely',
  'Sometimes',
  'Often',
  'Very Often',
  'Always',
];

const AnswerEditor = props => (
  // use props.questionType to switch between Scale and other type answers
  <StyledAnswerEditor>
    <Scale editMode values={tempVals} value={3} />
    <SaveBtn onSave={props.onSave} />
  </StyledAnswerEditor>
);

export default AnswerEditor;
