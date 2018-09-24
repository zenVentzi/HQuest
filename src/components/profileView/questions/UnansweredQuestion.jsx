import React, { Component } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import TextBtn from 'Reusable/TextBtn';
import QuestionEditor from './QuestionEditor';

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
  onClickAdd = () => {
    const { onClickAdd, question } = this.props;

    if (!this.answerValue && !question.defaultAnswer) {
      toast.error('🦄 Answer not provided');
      return;
    }

    /* else if < minimumAnswerLength .toast.. */

    onClickAdd({
      questionId: question.id,
      answerValue: this.answerValue || question.defaultAnswer,
    });
  };

  render() {
    const { question, style, onDoesNotApply } = this.props;

    return (
      // on save, refetch
      <StyledQuestion style={style}>
        <QuestionEditor
          question={question}
          onChange={answerValue => {
            this.answerValue = answerValue;
          }}
        />
        <EditorButtons>
          <div>
            <TextBtn onClick={this.onClickAdd}>Add</TextBtn>
          </div>
          <TextBtn onClick={onDoesNotApply}>Does not apply</TextBtn>
        </EditorButtons>
      </StyledQuestion>
    );
  }
}

export default UnansweredQuestion;
