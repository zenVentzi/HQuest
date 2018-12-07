import React from 'react';
import Text from './Text

const Answer = props => {
  const {
    viewMode,
    onChange,
    question: { answer },
  } = props;

  const answerValue = answer ? answer.value : undefined;
  return <Text viewMode={viewMode} answer={answerValue} onChange={onChange} />;
};

export default Answer;
