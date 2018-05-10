import React from 'react';
import AnswerViewer from './AnswerViewer';
import AnswerEditor from './AnswerEditor';

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
      <div className="answer-container">
        {this.state.isEditMode ?
          <AnswerEditor onSave={this.onSave} /> :
          <AnswerViewer onEdit={this.onEdit} />}
      </div>
    );
  }
}

export default Answer;
