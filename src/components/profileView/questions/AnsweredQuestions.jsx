import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';
import AnsweredQuestionsGql from './AnsweredQuestionsGql';

const Empty = styled.div`
  text-align: center;
  width: 100%;
`;

const AnsweredQuestions = ({ isPersonal, questions, refetch, ...style }) => {
  const onClickSave = (editAnswer, answerId) => async answerValue => {
    const variables = { answerId, answerValue };
    await editAnswer({ variables });
    toast.success('🦄 Answer edited!');
  };
  const onClickRemove = (removeAnswer, answerId) => async () => {
    const variables = { answerId };
    await removeAnswer({ variables });
    toast.success('🦄 Answer removed!');
    refetch();
  };
  const onMovePosition = ({ moveAnswerPosition, answerId }) => async ({
    newPosition,
  }) => {
    const variables = { answerId, position: newPosition };
    await moveAnswerPosition({ variables });
    toast.success('🦄 Question moved!');
    refetch();
  };

  if (!questions.length) {
    return <Empty style={style}> No answered questions </Empty>;
  }

  return (
    <AnsweredQuestionsGql>
      {(editAnswer, removeAnswer, moveAnswerPosition) => {
        return questions.map(q => (
          <Fragment key={q.id}>
            <AnsweredQuestion
              collapseComments
              style={style}
              isPersonal={isPersonal}
              question={q}
              onClickSave={onClickSave(editAnswer, q.answer.id)}
              onClickRemove={onClickRemove(removeAnswer, q.answer.id)}
              onMovePosition={onMovePosition({
                moveAnswerPosition,
                answerId: q.answer.id,
              })}
            />
          </Fragment>
        ));
      }}
    </AnsweredQuestionsGql>
  );
};

export default AnsweredQuestions;
