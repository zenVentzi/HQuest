import React, { Fragment } from 'react';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

const AnsweredQuestions = ({ isPersonal, questions, ...style }) => {
  return questions.length > 0 ? (
    questions.map(q => (
      <Fragment key={q.id}>
        <AnsweredQuestion
          collapseComments
          style={style}
          isPersonal={isPersonal}
          question={q}
        />
      </Fragment>
    ))
  ) : (
    <Empty style={style}> No answered questions </Empty>
  );
};

export default AnsweredQuestions;
