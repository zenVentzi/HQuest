import React, { CSSProperties, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import { getLoggedUserId } from "Utils";
import Anchor from "Reusable/Anchor";
import LikeBtn from "./Answer/LikeBtn";
import Question from "./Question";
import Comments from "./Answer/Comments";
import Likes from "./Answer/Likes";
import Editions from "./Answer/Editions";
import OptionsDropdown from "./Answer/Options";
import AnswerEditor from "./Answer/AnswerEditor";
import AnswerViewer from "./Answer/AnswerViewer";
import PositionEditor from "./Answer/PositionEditor";
import AnsweredQuestionGql from "./AnsweredQuestionGql";
import { MutationFn } from "react-apollo";
import {
  QuestionFieldsFragment,
  RemoveAnswerMutation,
  RemoveAnswerVariables,
  EditAnswerMutation,
  EditAnswerVariables,
  MoveAnswerPositionMutation,
  MoveAnswerPositionVariables,
  LikeAnswerMutation,
  LikeAnswerVariables
} from "GqlClient/autoGenTypes";

const StyledQuestion = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 2px solid white;
  margin-bottom: 2em;
  flex-direction: column;
  align-items: center;
`;

interface RowProps {
  hide?: boolean;
}

const Row = styled.div<RowProps>`
  display: flex;
  width: 100%;
  visibility: ${props => (props.hide ? "hidden" : "visible")};
  justify-content: center;
`;

const SmallBtn = styled(Anchor)`
  margin-right: 0.6em;
`;

interface AnsweredQuestionProps {
  question: QuestionFieldsFragment;
  // question: Required<QuestionFieldsFragment>;
  showComments: boolean;
  // onRemove: () => Promise<void>;
  scrollToComment?: string;
  totalQuestionsCount: number;
  isPersonal: boolean;
  style?: CSSProperties;
}

// interface Mla {
//   a?: { num: number } | null;
// }

// const mla: Mla = {};

// const bol = mla.a.num > 5; // no error here had to retart vscode 3 times ftw

const AnsweredQuestion = (props: AnsweredQuestionProps) => {
  // timeoutIndex: number;

  const timeoutIndex = useRef<number>();
  const { likes } = props.question.answer!;
  const [totalLikes, setTotalLikes] = useState(() => {
    return likes ? likes.total : 0;
  });
  const [userLikes, setUserLikes] = useState(() => {
    if (!likes) return 0;
    const user = likes.likers.find(
      (liker: any) => liker.user.id === getLoggedUserId()
    );

    return user ? user.numOfLikes : 0;
  });
  const [showLikes, setShowLikes] = useState(false);
  const [numOfComments, setNumOfComments] = useState(() => {
    const { comments: cments } = props.question.answer!;
    return cments ? cments.length : 0;
  });
  const [showComments, setShowComments] = useState(props.showComments);
  const [numOfEditions, setNumOfEditions] = useState(() => {
    const { editions } = props.question.answer!;
    return editions ? editions.length : 0;
  });
  const [showEditions, setShowEditions] = useState(false);
  const [showAnswerEditor, setShowAnswerEditor] = useState(false);
  const [showPositionEditor, setShowPositionEditor] = useState(false);
  const [hovered, setHovered] = useState(false);

  const onMouseEnter = () => {
    setHovered(true);
  };

  const onMouseLeave = () => {
    setHovered(false);
  };

  const onRemove = (
    mutation: MutationFn<RemoveAnswerMutation, RemoveAnswerVariables>
  ) => async () => {
    const answerId = props.question.answer!.id;
    const variables = { answerId };
    await mutation({ variables });
    toast.success("Answer removed!");
    // await props.onRemove();
  };

  const incrementNumOfComments = () => {
    setNumOfComments(numOfComments + 1);
  };

  const decrementNumOfComments = () => {
    setNumOfComments(numOfComments - 1);
  };

  // const toggleHovered = (value: boolean) => {
  //   setState({ ...state, hovered: value });
  // };

  const openAnswerEditor = () => {
    setShowAnswerEditor(true);
    setShowPositionEditor(false);
  };

  const closeAnswerEditor = () => {
    setShowAnswerEditor(false);
  };

  const openPositionEditor = () => {
    setShowPositionEditor(true);
    setShowAnswerEditor(false);
  };

  const closePositionEditor = () => {
    setShowPositionEditor(false);
  };

  const onSaveAnswer = (
    mutation: MutationFn<EditAnswerMutation, EditAnswerVariables>
  ) => async (answerValue: string) => {
    const isTheSame = props.question.answer!.value === answerValue;

    if (isTheSame) {
      closeAnswerEditor();
      toast.success("No changes");
      return;
    }

    const answerId = props.question.answer!.id;
    const variables = { answerId, answerValue };
    await mutation({ variables });
    toast.success("Answer edited!");

    setNumOfEditions(numOfEditions + 1);
    closeAnswerEditor();
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    setShowLikes(false);
    setShowEditions(false);
  };

  // onEditComment: any;

  const toggleLikes = () => {
    setShowLikes(!showLikes);
    setShowComments(false);
    setShowEditions(false);
  };

  const toggleEditions = () => {
    setShowEditions(!showEditions);
    setShowComments(false);
    setShowLikes(false);
  };

  const onMovePosition = (
    mutation: MutationFn<
      MoveAnswerPositionMutation,
      MoveAnswerPositionVariables
    >
  ) => async (newPosition: number) => {
    const answerId = props.question.answer!.id;
    const variables = { answerId, position: newPosition };
    await mutation({ variables });
    // await props.onClickMove({ newPosition });
    toast.success("Question moved!");
    closePositionEditor();
  };

  const wait = async (milliseconds: number) => {
    return new Promise(resolve => {
      timeoutIndex.current = setTimeout(resolve, milliseconds);
    });
    // return new Promise(resolve => setTimeout(resolve, milliseconds));
  };

  const cancelPrevWait = () => {
    if (timeoutIndex) {
      clearTimeout(timeoutIndex.current);
      timeoutIndex.current = undefined;
    }
  };

  const onClickLike = (
    mutation: MutationFn<LikeAnswerMutation, LikeAnswerVariables>
  ) => async () => {
    if (userLikes === 20) {
      toast.error("20 likes is the limit");
      return;
    }

    setUserLikes(userLikes + 1);
    setTotalLikes(totalLikes + 1);
    cancelPrevWait();
    await wait(500);
    /* because the user can click multiple times in a row, creating too many sequential requests to the server */
    const answerId = props.question.answer!.id;
    const variables = { answerId, userLikes };
    await mutation({ variables });
  };

  const {
    question,
    scrollToComment,
    totalQuestionsCount,
    isPersonal,
    style
  } = props;

  const { comments } = question.answer!;

  const likeBtnText = totalLikes === 1 ? "1 Like" : `${totalLikes} Likes`;
  const commentBtnText =
    numOfComments === 1 ? `1 Comment` : `${numOfComments} Comments`;
  const editionsBtnText =
    numOfEditions === 1 ? `1 Edition` : `${numOfEditions} Editions`;

  return (
    <AnsweredQuestionGql>
      {(editAnswer, removeAnswer, moveAnswerPosition, likeAnswer) => {
        return (
          <StyledQuestion
            onMouseEnter={onMouseEnter}
            onFocus={onMouseEnter}
            onMouseLeave={onMouseLeave}
            // onBlur={onMouseLeave}
            style={style}
          >
            <Row>
              <Question question={question.value} />
              <OptionsDropdown
                visible={isPersonal && hovered}
                onClickEdit={openAnswerEditor}
                onClickRemove={onRemove(removeAnswer)}
                onClickMove={openPositionEditor}
              />
            </Row>
            {showAnswerEditor ? (
              <AnswerEditor
                answer={question.answer}
                onClickDoesNotApply={() => {}}
                onClickSave={onSaveAnswer(editAnswer)}
              />
            ) : (
              <AnswerViewer answer={question.answer} />
            )}
            {showPositionEditor && (
              <PositionEditor
                position={question.answer!.position}
                maxPosition={totalQuestionsCount}
                onClickMove={onMovePosition(moveAnswerPosition)}
                onClickClose={closePositionEditor}
              />
            )}
            <Row hide={!hovered}>
              <LikeBtn
                onClick={onClickLike(likeAnswer)}
                isLiked={totalLikes > 0}
              />
              <SmallBtn onClick={toggleLikes}>{likeBtnText}</SmallBtn>
              <SmallBtn onClick={toggleComments}>{commentBtnText}</SmallBtn>
              {!!numOfEditions && (
                <SmallBtn onClick={toggleEditions}>{editionsBtnText}</SmallBtn>
              )}
            </Row>
            {showLikes && (
              <Likes onClose={toggleLikes} likes={question.answer!.likes} />
            )}
            {showEditions && (
              <Editions
                editions={question.answer!.editions}
                onClose={toggleEditions}
              />
            )}
            {(scrollToComment || showComments) && (
              <Comments
                comments={comments}
                answerId={question.answer!.id}
                scrollToComment={scrollToComment}
                onAddComment={incrementNumOfComments}
                // onEditComment={onEditComment}
                onRemoveComment={decrementNumOfComments}
              />
            )}
          </StyledQuestion>
        );
      }}
    </AnsweredQuestionGql>
  );
};

export default AnsweredQuestion;
