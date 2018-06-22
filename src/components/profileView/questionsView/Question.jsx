import React, { Component } from 'react';
import styled from 'styled-components';
import Answer from './Answer/Answer';

const StyledQuestion = styled.div`
  /* border: 3px solid black; */
  width: 100%;
`;
class Question extends Component {
  state = {
    hovered: false,
  };

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  render() {
    const { question, onSave } = this.props;
    const answerProps = { type: question.type };

    if (onSave) {
      answerProps.onSave = onSave;
    }

    if (question.answer) {
      answerProps.value = question.answer.value;
    }

    return (
      <StyledQuestion
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <p> {question.value} </p>
        <Answer {...answerProps} hovered={this.state.hovered} />
      </StyledQuestion>
    );
  }
}

export default Question;
