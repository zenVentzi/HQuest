import React from 'react';
import styled from 'styled-components';
import AnswerViewer from './AnswerViewer';
import AnswerEditor from './AnswerEditor';

const StyledAnswer = styled.div`
  margin-top: 0.5em;`;

class Answer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditMode: true,
    };
  }

  componentWillMount() {
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  onSave() {
    this.toggleEditMode();
  }

  onEdit() {
    this.toggleEditMode();
  }

  toggleEditMode() {
    const newState = { ...this.state };
    newState.isEditMode = !this.state.isEditMode;
    this.setState(newState);
  }

  render() {
    return (
      <StyledAnswer>
        {this.state.isEditMode ?
          <AnswerEditor onSave={this.onSave} /> :
          <AnswerViewer onEdit={this.onEdit} />}
      </StyledAnswer>
    );
  }
}

export default Answer;
