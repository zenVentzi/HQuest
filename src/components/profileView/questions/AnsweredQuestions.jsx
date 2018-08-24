import React, { Fragment } from 'react';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';

const Empty = styled.div`
  text-align: center;
`;

const AnsweredQuestions = ({ showButtons, questions, ...style }) => {
  const test = 5;

  return questions.length > 0 ? (
    questions.map(q => (
      <AnsweredQuestion
        key={q.id}
        style={style}
        showButtons={showButtons}
        question={q}
      />
    ))
  ) : (
    <Empty style={style}> No answered questions </Empty>
  );
};

export default AnsweredQuestions;
