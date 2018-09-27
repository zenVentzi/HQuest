import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import TextBtn from 'Reusable/TextBtn';
import AnswerEditor from './Answer/AnswerEditor';
import Question from './Question';

const StyledQuestion = styled.div`
  /* border: 3px solid black; */
  width: 100%;
  /* height: 100px; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditorButtons = styled.div`
  display: flex;
  width: 80%;
  justify-content: center;
  & + {
    margin-right: 1em;
  }
`;

class UnansweredQuestion extends Component {
  onClickSave = ({ answerValue }) => {
    const { onClickSave, question } = this.props;

    if (!answerValue && !question.defaultAnswer) {
      toast.error('🦄 Answer not provided');
      return;
    }

    /* else if < minimumAnswerLength .toast.. */

    onClickSave({
      answerValue: answerValue || question.defaultAnswer,
    });
  };

  onClickDoesNotApply = () => {
    this.props.onClickDoesNotApply();
  };

  render() {
    const { question, style } = this.props;

    return (
      <StyledQuestion style={style}>
        <Question question={question.question} />
        <AnswerEditor
          answerType={question.type}
          answer={question.answer.value}
          possibleAnswers={question.possibleAnswers}
          onClickSave={this.onClickSave}
          onClickDoesNotApply={this.onClickDoesNotApply}
        />
      </StyledQuestion>
    );
  }
}

export default UnansweredQuestion;
