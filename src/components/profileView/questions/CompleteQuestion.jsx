import React, { Component } from 'react';
import styled from 'styled-components';
import QuestionViewer from './QuestionViewer';
import QuestionEditor from './QuestionEditor';

const StyledQuestion = styled.div`
  /* border: 3px solid black; */
  width: 100%;
`;

class CompleteQuestion extends Component {
  state = {
    hovered: false,
    viewMode: !!this.props.question.answer,
  };

  onMouseEnter = () => {
    this.toggleHovered();
  };

  onMouseLeave = () => {
    this.toggleHovered();
  };

  onClickEdit = () => {
    this.toggleViewMode();
  };

  onSaved = () => {
    this.toggleViewMode();
  };

  toggleHovered = () => {
    this.setState({ ...this.state, hovered: !this.state.hovered });
  };

  toggleViewMode = () => {
    this.setState({ ...this.state, viewMode: !this.state.viewMode });
  };

  render() {
    const { hovered, viewMode } = this.state;
    const { userId, question } = this.props;

    return (
      <StyledQuestion
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {viewMode ? (
          <QuestionViewer
            userId={userId}
            hovered={hovered}
            question={question}
            onClickEdit={this.onClickEdit}
          />
        ) : (
          <QuestionEditor
            userId={userId}
            question={question}
            onSaved={this.onSaved}
          />
        )}
      </StyledQuestion>
    );
  }
}

export default CompleteQuestion;
