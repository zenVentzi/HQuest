import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import AnsweredQuestion from './AnsweredQuestion';
import AnsweredQuestionsGql from './AnsweredQuestionsGql';

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
  // TODO rename to onRemove etc.
  const onClickSave = (editAnswer, answerId) => async ({ answerValue }) => {
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
  const onClickMove = ({ moveAnswerPosition, answerId }) => async ({
    newPosition,
  }) => {
    const variables = { answerId, position: newPosition };
    await moveAnswerPosition({ variables });
    toast.success('🦄 Question moved!');
    refetch();
  };

  const onClickLike = ({ likeAnswer, answerId }) => async ({ numOfLikes }) => {
    const variables = { answerId, numOfLikes };
    await likeAnswer({ variables });
    // toast.success('Liked answer!');
    refetch();
  };

  const onComment = ({ commentAnswer, answerId }) => async () => {
    const variables = { answerId };
    await commentAnswer({ variables });
    toast.success('Comment added!');
    refetch();
  };

  if (!questions.length) {
    return <Empty style={style}> No answered questions </Empty>;
  }

  return (
    <AnsweredQuestionsGql>
      {(
        editAnswer,
        removeAnswer,
        moveAnswerPosition,
        likeAnswer,
        commentAnswer
      ) => {
        const res = questions.map(q => (
          <Fragment key={q.id}>
            <AnsweredQuestion
              collapseComments
              style={style}
              isPersonal={isPersonal}
              question={q}
              totalQuestionsCount={totalCount}
              onClickSave={onClickSave(editAnswer, q.answer.id)}
              onClickRemove={onClickRemove(removeAnswer, q.answer.id)}
              onClickMove={onClickMove({
                moveAnswerPosition,
                answerId: q.answer.id,
              })}
              onClickLike={onClickLike({ likeAnswer, answerId: q.answer.id })}
              onComment={onComment({ commentAnswer, answerId: q.answer.id })}
            />
          </Fragment>
        ));

        return res;
      }}
    </AnsweredQuestionsGql>
  );
};

export default AnsweredQuestions;
