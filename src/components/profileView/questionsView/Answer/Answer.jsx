import React from 'react';
import styled from 'styled-components';
import AnswerViewer from './AnswerViewer';
import AnswerEditor from './AnswerEditor';

const StyledAnswer = styled.div`
  margin-top: 0.5em;
  /* border: 1px solid black; */
  justify-content: center;
`;

class Answer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      payload: 7,
      viewMode: this.props.viewMode,
    };
  }

  onSave = () => {
    this.toggleViewMode();
    this.props.onSave();
  };

  onEdit = () => {
    this.toggleViewMode();
  };

  toggleViewMode = () => {
    const newState = { ...this.state };
    newState.viewMode = !this.state.viewMode;
    this.setState(newState);
  };

  render() {
    return (
      <StyledAnswer>
        {this.state.viewMode ? (
          <AnswerViewer
            onClickEdit={this.onEdit}
            showButtons={this.props.hovered}
          />
        ) : (
          <AnswerEditor onClickSave={this.onSave} />
        )}
      </StyledAnswer>
    );
  }
}

export default Answer;
