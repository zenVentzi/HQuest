import React, { Component } from 'react';
import styled from 'styled-components';
import QuestionViewer from './QuestionViewer';
import QuestionEditor from './QuestionEditor';

const StyledQuestion = styled.div`
  /* border: 3px solid black; */
  width: 100%;
  /* height: 100px; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class AnsweredQuestion extends Component {
  state = {
    hovered: false,
    viewMode: !!this.props.question.answer,
  };

  onMouseOver = () => {
    this.toggleHovered(true);
  };

  onMouseLeave = () => {
    this.toggleHovered(false);
  };

  toggleHovered = value => {
    this.setState({ ...this.state, hovered: value });
  };

  toggleViewMode = () => {
    this.setState({ ...this.state, viewMode: !this.state.viewMode });
  };

  render() {
    const { hovered, viewMode } = this.state;
    const { question, editable, collapseComments, style } = this.props;

    return (
      <StyledQuestion
        onMouseOver={this.onMouseOver}
        onFocus={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onBlur={this.onMouseLeave}
        style={style}
      >
        {viewMode ? (
          <QuestionViewer
            hovered={hovered}
            editable={editable}
            question={question}
            collapseComments={collapseComments}
            onClickEdit={this.toggleViewMode}
          />
        ) : (
          <QuestionEditor question={question} onSaved={this.toggleViewMode} />
        )}
      </StyledQuestion>
    );
  }
}

export default AnsweredQuestion;
