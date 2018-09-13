import React, { Fragment } from 'react';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

const AnsweredQuestions = ({ isPersonal, questions, ...style }) => {
  const onEditAnswer = answerId => answerValue => {};

  return questions.length > 0 ? (
    questions.map(q => (
      <Fragment key={q.id}>
        <AnsweredQuestion
          collapseComments
          style={style}
          isPersonal={isPersonal}
          question={q}
          onSave={onEditAnswer(q.answer.id)}
        />
      </Fragment>
    ))
  ) : (
    <Empty style={style}> No answered questions </Empty>
  );
};

export default AnsweredQuestions;
