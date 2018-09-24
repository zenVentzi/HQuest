import React, { Fragment } from 'react';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';
import AnsweredQuestionsGql from './AnsweredQuestionsGql';

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

const AnsweredQuestions = ({ isPersonal, questions, refetch, ...style }) => {
  const onClickEdit = (editAnswer, answerId) => async answerValue => {
    const variables = { answerId, answerValue };
    await editAnswer({ variables });
    // success toastr
  };
  const onClickRemove = (removeAnswer, answerId) => async () => {
    const variables = { answerId };
    await removeAnswer({ variables });
    refetch();
    // success toastr
  };

  if (!questions.length) {
    return <Empty style={style}> No answered questions </Empty>;
  }

  /* 
  
  1) 
  
  */

  return (
    <AnsweredQuestionsGql>
      {(editAnswer, removeAnswer) => {
        return questions.map(q => (
          <Fragment key={q.id}>
            <AnsweredQuestion
              collapseComments
              style={style}
              isPersonal={isPersonal}
              question={q}
              onClickEdit={onClickEdit(editAnswer, q.answer.id)}
              onClickRemove={onClickRemove(removeAnswer, q.answer.id)}
            />
          </Fragment>
        ));
      }}
    </AnsweredQuestionsGql>
  );
};

export default AnsweredQuestions;
