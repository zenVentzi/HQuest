import React, { useState, useRef, useEffect } from "react";
import { useAsyncEffect } from "use-async-effect";
import {
  QuestionFieldsAnswer,
  EditAnswerMutation,
  EditAnswerVariables,
  MoveAnswerPositionMutation,
  MoveAnswerPositionVariables,
  LikeAnswerMutation,
  LikeAnswerVariables,
  RemoveAnswerMutation,
  RemoveAnswerVariables
} from "GqlClient/autoGenTypes";
import { toast } from "react-toastify";
import { getLoggedUserId } from "Utils";
import { MutationFn } from "react-apollo";
import Anchor from "Reusable/Anchor";
import AnswerViewer from "./AnswerViewer";
import AnswerEditor from "./AnswerEditor";
import LikeBtn from "./LikeBtn";
import AnswerGql from "./AnswerGql";
import PositionEditor from "./PositionEditor";
import { Row } from "../Row";

import styled from "styled-components";
import Likes from "./Likes";
import Comments from "./Comments";

const SmallBtn = styled(Anchor)`
  margin-right: 0.6em;
`;

interface AnswerProps {
  viewMode: boolean;
  showPositionEditor: boolean;
  remove: boolean;
  answer: QuestionFieldsAnswer;
  totalQuestionsCount: number;
  showComments: boolean;
  onCloseAnswerEditor: () => void;
  onClosePositionEditor: () => void;
  scrollToComment?: string;
}

const Answer = (props: AnswerProps) => {
  // const { viewMode, answer, showPositionEditor } = props;
  const timeoutIndex = useRef<number>();
  const removeMutation = useRef<
    MutationFn<RemoveAnswerMutation, RemoveAnswerVariables>
  >();

  const [totalLikes, setTotalLikes] = useState(() => {
    return props.answer.likes ? props.answer.likes.total : 0;
  });
  const [userLikes, setUserLikes] = useState(() => {
    if (!props.answer.likes) return 0;
    const user = props.answer.likes.likers.find(
      (liker: any) => liker.user.id === getLoggedUserId()
    );

    return user ? user.numOfLikes : 0;
  });
  const [showComments, setShowComments] = useState(props.showComments);
  const [showLikes, setShowLikes] = useState(false);
  const [numOfComments, setNumOfComments] = useState(() => {
    const { comments: cments } = props.answer!;
    return cments ? cments.length : 0;
  });

  useAsyncEffect(
    async () => {
      if (props.remove) {
        const answerId = props.answer!.id;
        const variables = { answerId };
        await removeMutation.current!({ variables });
        toast.success("Answer removed!");
      }
    },
    undefined,
    [props.remove]
  );

  const onSaveAnswer = (
    mutation: MutationFn<EditAnswerMutation, EditAnswerVariables>
  ) => async (answerValue: string) => {
    const isTheSame = props.answer!.value === answerValue;

    if (isTheSame) {
      // closeAnswerEditor();
      // setViewMode(true);
      props.onCloseAnswerEditor();
      toast.success("No changes");
      return;
    }

    const answerId = props.answer!.id;
    const variables = { answerId, answerValue };
    await mutation({ variables });
    toast.success("Answer edited!");

    // setNumOfEditions(numOfEditions + 1);
    // closeAnswerEditor();
    props.onCloseAnswerEditor();
  };

  const onMovePosition = (
    mutation: MutationFn<
      MoveAnswerPositionMutation,
      MoveAnswerPositionVariables
    >
  ) => async (newPosition: number) => {
    const answerId = props.answer!.id;
    const variables = { answerId, position: newPosition };
    await mutation({ variables });
    // await props.onClickMove({ newPosition });
    toast.success("Answer moved!");
    props.onClosePositionEditor();
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
    const answerId = props.answer!.id;
    const variables = { answerId, userLikes };
    await mutation({ variables });
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

  const toggleComments = () => {
    setShowComments(!showComments);
    setShowLikes(false);
    // setShowEditions(false);
  };

  const toggleLikes = () => {
    setShowLikes(!showLikes);
    setShowComments(false);
    // setShowEditions(false);
  };

  const numofLikesText = totalLikes === 1 ? "1 Like" : `${totalLikes} Likes`;
  const numOfCommentsText =
    numOfComments === 1 ? `1 Comment` : `${numOfComments} Comments`;
  // const editionsBtnText =
  //   numOfEditions === 1 ? `1 Edition` : `${numOfEditions} Editions`;
  // console.log(props.viewMode);

  return (
    <AnswerGql>
      {(editAnswer, removeAnswer, moveAnswerPosition, likeAnswer) => {
        removeMutation.current = removeAnswer;
        return (
          <>
            {props.viewMode ? (
              <AnswerViewer answer={props.answer!} />
            ) : (
              <AnswerEditor
                answer={props.answer}
                onClickDoesNotApply={() => {}}
                onClickSave={onSaveAnswer(editAnswer)}
              />
            )}
            {props.showPositionEditor && (
              <PositionEditor
                position={props.answer!.position}
                maxPosition={props.totalQuestionsCount}
                onClickMove={onMovePosition(moveAnswerPosition)}
                onClickClose={props.onClosePositionEditor}
              />
            )}
            <Row hide=/* {!hovered} */ {!props.viewMode}>
              <LikeBtn
                onClick={onClickLike(likeAnswer)}
                isLiked={totalLikes > 0}
              />
              <SmallBtn onClick={toggleLikes}>{numofLikesText}</SmallBtn>
              <SmallBtn onClick={toggleComments}>{numOfCommentsText}</SmallBtn>
            </Row>
            {props.viewMode && showLikes && (
              <Likes onClose={toggleLikes} likes={props.answer!.likes} />
            )}
            {props.viewMode && (props.scrollToComment || showComments) && (
              <Comments
                comments={props.answer.comments}
                answerId={props.answer.id}
                scrollToComment={props.scrollToComment}
                onAddComment={() => {
                  setNumOfComments(numOfComments + 1);
                }}
                // onEditComment={onEditComment}
                onRemoveComment={() => {
                  setNumOfComments(numOfComments - 1);
                }}
              />
            )}
          </>
        );
      }}
    </AnswerGql>
  );
};

export default Answer;
