import React from 'react';
import StyledBtn from './StyledBtn';

const EditorButtons = (props) => {
  const test = 5;

  return (
    <div>
      <StyledBtn
        onClick={() => { props.onSave(); }}
      >
          Save
      </StyledBtn>
      <StyledBtn
        onClick={() => { props.onClear(props.questionId); }}
      >
        Clear
      </StyledBtn>
    </div>
  );
};

export default EditorButtons;
