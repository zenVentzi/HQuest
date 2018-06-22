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
    const {
      question: { value, type, answer },
      viewMode,
      onSave,
    } = this.props;

    const answerProps = {
      type,
      viewMode,
      hovered: this.state.hovered,
    };

    if (onSave) {
      answerProps.onSave = onSave;
    }

    if (answer) {
      answerProps.value = answer.value;
    }

    return (
      <StyledQuestion
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <p> {value} </p>
        <Answer {...answerProps} />
      </StyledQuestion>
    );
  }
}

export default Question;
