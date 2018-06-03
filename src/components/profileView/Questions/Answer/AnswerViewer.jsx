import React from 'react';
import Rating from './Rating';
import StyledBtn from './StyledBtn';

const AnswerViewer = (props) => {
  const btnName = props.hasAnswer ?
    'Edit' : 'Answer';

  return (
    <div>
      <Rating editMode={false} questionId={props.questionId} />
      <StyledBtn onClick={() => { props.onEdit(); }}>Edit</StyledBtn>
    </div>
  );
};

export default AnswerViewer;
