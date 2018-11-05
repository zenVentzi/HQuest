import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

import Scale from './Types/Scale';
import Options from './Types/Options';
import Text from './Types/Text';
import { QuestionTypes } from '../../../../constants';

const { TEXT, SCALE, OPTIONS } = QuestionTypes;

const Buttons = styled.div`
  display: flex;
  width: 80%;
  justify-content: center;
  margin-bottom: 1em;
  & + {
    margin-right: 1em;
  }
`;

class AnswerEditor extends Component {
  constructor(props) {
    super(props);

    let answerValue;

    if (this.props.answer) {
      answerValue = this.props.answer.value;
    } else {
      answerValue = this.props.defaultAnswer || '';
    }

    this.state = { answerValue };
  }

  onChange = editedAnswer => {
    const newState = { ...this.state, answerValue: editedAnswer };
    this.setState(newState);
  };

  onClickSave = () => {
    const { answerValue } = this.state;
    this.props.onClickSave({ answerValue });
  };

  onClickDoesNotApply = () => {
    this.props.onClickDoesNotApply();
  };

  renderAnswer() {
    const { questionType, possibleAnswers } = this.props;
    const { answerValue } = this.state;

    let result;

    switch (questionType) {
      case TEXT:
        result = (
          <Text
            viewMode={false}
            answer={answerValue}
            onChange={this.onChange}
          />
        );
        break;
      case SCALE:
        result = (
          <Scale
            viewMode={false}
            values={possibleAnswers}
            value={answerValue}
            onChange={this.onChange}
          />
        );
        break;
      case OPTIONS:
        result = (
          <Options
            viewMode={false}
            options={possibleAnswers}
            option={answerValue}
            onChange={this.onChange}
          />
        );
        break;
      default:
        break;
    }

    return result;
  }

  render() {
    const { isNew } = !this.props.answer;

    return (
      <Fragment>
        {this.renderAnswer()}
        <Buttons>
          <TextBtn onClick={this.onClickSave}>Save</TextBtn>
          {isNew && (
            <TextBtn onClick={this.onDoesNotApply}>Does not apply</TextBtn>
          )}
        </Buttons>
      </Fragment>
    );
  }
}

export default AnswerEditor;
