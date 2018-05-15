import React from 'react';
import { connect } from 'react-redux';
import { clearAnswer } from '../../../../actions/actionCreators';
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

const mapDispatchToProps = dispatch => ({
  onClear: (questionId) => {
    dispatch(clearAnswer(questionId));
  },
});

export default connect(null, mapDispatchToProps)(EditorButtons);
