import React, { Fragment } from 'react';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

const AnsweredQuestions = ({ showButtons, questions, ...style }) => {
  return questions.length > 0 ? (
    questions.map(q => (
      <Fragment key={q.id}>
        <AnsweredQuestion
          style={style}
          showButtons={showButtons}
          question={q}
        />
      </Fragment>
    ))
  ) : (
    <Empty style={style}> No answered questions </Empty>
  );
};

export default AnsweredQuestions;
