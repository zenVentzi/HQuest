import React, { Component } from 'react';
import styled from 'styled-components';
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
  render() {
    const { question, style, onAdd, onNext, onDoesNotApply } = this.props;

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
            <TextBtn
              onClick={() => {
                onAdd(this.answerValue);
              }}
            >
              Add
            </TextBtn>
          </div>
          <TextBtn onClick={onDoesNotApply}>Does not apply</TextBtn>
        </EditorButtons>
      </StyledQuestion>
    );
  }
}

export default UnansweredQuestion;
