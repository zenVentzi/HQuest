import React from 'react';
import styled from 'styled-components';
import AnswerViewer from './AnswerViewer';
import AnswerEditor from './AnswerEditor';

const StyledAnswer = styled.div`
  margin-top: 0.5em;
  border: 1px solid black;
  justify-content: center;
`;

class Completed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payload: 7,
      editMode: this.props.editMode,
    };
  }

  onSave = () => {
    this.toggleEditMode();
    this.props.onSave();
  };

  onEdit = () => {
    this.toggleEditMode();
  };

  toggleEditMode = () => {
    const newState = { ...this.state };
    newState.editMode = !this.state.editMode;
    this.setState(newState);
  };

  render() {
    return (
      <StyledAnswer>
        {this.state.editMode ? (
          <AnswerEditor onSave={this.onSave} />
        ) : (
          <AnswerViewer onEdit={this.onEdit} />
        )}
      </StyledAnswer>
    );
  }
}

export default Completed;
