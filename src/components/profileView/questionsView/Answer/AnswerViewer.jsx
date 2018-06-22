import React, { Fragment } from 'react';
import styled from 'styled-components';
import Scale from './Scale';
import StyledBtn from './StyledBtn';

const Btn = styled(StyledBtn)`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`;

const EditBtn = props => (
  <Btn
    onClick={() => {
      props.onEdit();
    }}
    visible={props.visible}
  >
    Edit
  </Btn>
);

const RemoveBtn = props => (
  <Btn
    onClick={() => {
      props.onRemove();
    }}
    visible={props.visible}
  >
    Remove
  </Btn>
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
    <EditBtn onEdit={props.onEdit} visible={props.hovered} />
    <RemoveBtn onEdit={props.onRemove} visible={props.hovered} />
  </Fragment>
);

export default AnswerViewer;
