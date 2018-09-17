import React, { Fragment } from 'react';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

const AnsweredQuestions = ({ isPersonal, questions, ...style }) => {
  const onEditAnswer = answerId => answerValue => {};

  return questions.edges.length > 0 ? (
    questions.edges.map(edge => (
      <Fragment key={edge.node.id}>
        <AnsweredQuestion
          collapseComments
          style={style}
          isPersonal={isPersonal}
          question={edge.node}
          onSave={onEditAnswer(edge.node.answer.id)}
        />
      </Fragment>
    ))
  ) : (
    <Empty style={style}> No answered questions </Empty>
  );
};

export default AnsweredQuestions;
