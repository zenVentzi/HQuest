import React, { Fragment } from 'react';
import styled from 'styled-components';
import Scale from './Scale';
import StyledBtn from './StyledBtn';

const Btn = styled(StyledBtn)`
  display: none;
`;

const EditBtn = props => (
  <StyledBtn
    onClick={() => {
      props.onEdit();
    }}
  >
    Edit
  </StyledBtn>
);

const RemoveBtn = props => (
  <StyledBtn
    onClick={() => {
      props.onRemove();
    }}
  >
    Remove
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

const AnswerViewer = props => (
  <Fragment>
    <Scale editMode={false} values={tempVals} value={3} />
    <EditBtn onEdit={props.onEdit} />
    <RemoveBtn onEdit={props.onRemove} />
  </Fragment>
);

export default AnswerViewer;
