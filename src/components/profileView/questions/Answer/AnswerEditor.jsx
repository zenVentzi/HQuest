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
  & + {
    margin-right: 1em;
  }
`;

class AnswerEditor extends Component {
  state = {
    answerValue: this.props.answerValue,
  };

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
    const { questionType, possibleAnswers, answer } = this.props;

    let result;

    switch (questionType) {
      case TEXT:
        result = (
          <Text
            viewMode={false}
            answer={answer.value}
            onChange={this.onChange}
          />
        );
        break;
      case SCALE:
        result = (
          <Scale
            viewMode={false}
            values={possibleAnswers}
            value={answer.value}
            onChange={this.onChange}
          />
        );
        break;
      case OPTIONS:
        result = (
          <Options
            viewMode={false}
            options={possibleAnswers}
            option={answer.value}
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
    const { isNew } = this.props;

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
