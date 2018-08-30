import React from 'react';
import Scale from './Scale';
import Options from './Options';
import Text from './Text';
import { QuestionTypes } from '../../../../constants';

const Answer = props => {
  const { TEXT, SCALE, OPTIONS /* WOULD_YOU_SINGLE */ } = QuestionTypes;
  const {
    viewMode,
    onChange,
    question: { type, possibleAnswers, answer },
  } = props;

  let result;
  const answerValue = answer ? answer.value : undefined;

  switch (type) {
    case TEXT:
      result = (
        <Text viewMode={viewMode} answer={answerValue} onChange={onChange} />
      );
      break;
    case SCALE:
      result = ( // TODO add onChange
        <Scale
          viewMode={viewMode}
          values={possibleAnswers}
          value={answerValue}
          onChange={onChange}
        />
      );
      break;
    case OPTIONS:
      result = (
        <Options
          viewMode={viewMode}
          options={possibleAnswers}
          option={answerValue}
          onChange={onChange}
        />
      );
      break;
    default:
      break;
  }
  return result;
};

export default Answer;
