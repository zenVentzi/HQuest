import React, { Component } from 'react';
import styled from 'styled-components';
import QuestionEditor from './QuestionEditor';

const StyledQuestion = styled.div`
  /* border: 3px solid black; */
  width: 100%;
  /* height: 100px; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class UnansweredQuestion extends Component {
  render() {
    const { question, style } = this.props;

    return (
      <StyledQuestion style={style}>
        <QuestionEditor question={question} onSaved={this.toggleViewMode} />
      </StyledQuestion>
    );
  }
}

export default UnansweredQuestion;
