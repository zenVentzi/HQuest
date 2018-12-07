import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

const TextArea = styled.textarea`
  display: block;
  margin: 1em auto;
  text-align: center;
  /* margin-left: auto; */
  margin-bottom: 1em;
  overflow: hidden;
  width: 80%;
`;

const Buttons = styled.div`
  display: flex;
  width: 80%;
  justify-content: center;
  margin-bottom: 1em;
`;

const LeftBtn = styled(TextBtn)`
  margin-right: 1em;
`;
const RightBtn = styled(TextBtn)``;

class AnswerEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { answerValue: this.props.answer || '' };
  }

  onChange = e => {
    const newState = { ...this.state, answerValue: e.target.value };
    this.setState(newState);
  };

  onClickSave = () => {
    const { answerValue } = this.state;
    this.props.onClickSave({ answerValue });
  };

  onDoesNotApply = () => {
    this.props.onClickDoesNotApply();
  };

  render() {
    const { answerValue } = this.state;
    const isNew = !this.props.answer;

    return (
      <Fragment>
        <TextArea
          placeholder="Answer..."
          defaultValue={answerValue}
          // maxLength={MAX_LENGTH}
          onChange={this.onChange}
        />
        <Buttons>
          <LeftBtn onClick={this.onClickSave}>Save</LeftBtn>
          {isNew && (
            <RightBtn onClick={this.onClickDoesNotApply}>
              Does not apply
            </RightBtn>
          )}
        </Buttons>
      </Fragment>
    );
  }
}

export default AnswerEditor;
