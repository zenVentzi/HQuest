import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import Scale from './Types/Scale';
import Options from './Types/Options';
import Text from './Types/Text';
import { QuestionTypes } from '../../../../constants';

const { TEXT, SCALE, OPTIONS } = QuestionTypes;

// could be made stateless
class AnswerViewer extends Component {
  render() {
    const { questionType, possibleAnswers, answer } = this.props;

    let answerType;

    switch (questionType) {
      case TEXT:
        answerType = <Text viewMode answer={answer.value} />;
        break;
      case SCALE:
        answerType = (
          <Scale viewMode values={possibleAnswers} value={answer.value} />
        );
        break;
      case OPTIONS:
        answerType = (
          <Options viewMode options={possibleAnswers} option={answer.value} />
        );
        break;
      default:
        break;
    }

    return answerType;
  }
}

export default AnswerViewer;
