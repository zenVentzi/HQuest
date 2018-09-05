import React from 'react';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

const AnsweredQuestions = ({ showButtons, questions, ...style }) => {
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
