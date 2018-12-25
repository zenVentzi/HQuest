import React, { Fragment } from 'react';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

const AnsweredQuestions = ({
  isPersonal,
  questions,
  totalCount,
  refetch,
  ...style
}) => {
  if (!questions.length) {
    return <Empty style={style}> No answered questions </Empty>;
  }

  const res = questions.map(q => (
    <AnsweredQuestion
      key={q.id}
      collapseComments
      style={style}
      isPersonal={isPersonal}
      question={q}
      totalQuestionsCount={totalCount}
    />
  ));

  return res;
};

export default AnsweredQuestions;
