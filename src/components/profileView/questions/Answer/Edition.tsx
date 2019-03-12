import React, { useEffect, useState, useRef } from "react";
import Anchor from "Reusable/Anchor";
import styled from "styled-components";
import shortid from "shortid";

import { Row } from "../Row";
import LikeBtn from "./LikeBtn";
import {
  AnswerFieldsEditions,
  LikeAnswerEditionMutation,
  LikeAnswerEditionVariables
} from "GqlClient/autoGenTypes";
import { getLoggedUserId } from "Utils";
import { MutationFn } from "react-apollo";
import { toast } from "react-toastify";
import Comments from "./Comments";
import Likes from "./Likes";

const SmallBtn = styled(Anchor)`
  margin-right: 0.6em;
`;

const Viewer = styled.div`
  background: black;
  text-align: left;
  color: white;
  width: 60%;
  font-size: 1.2em;
  line-height: 1.2;
  padding: 0.2em 1em;
  border-radius: 0.2em;
  word-wrap: break-word;
  /* text-align: center; */

  @media (max-width: 600px) {
    width: 90%;
    font-size: 1em;
  }
`;

interface EditionProps {
  edition: AnswerFieldsEditions;
  scrollToComment?: string;
  showComments?: boolean;
  answerId: string;
  likeEdition: MutationFn<
    LikeAnswerEditionMutation,
    LikeAnswerEditionVariables
  >;
}

const Edition = (props: EditionProps) => {
  const answerWithParagraphs = props.edition.value
    .split("\n")
    .map((paragraph: string) => (
      <span key={shortid.generate()}>
        {paragraph}
        <br />
      </span>
    ));

  const timeoutIndex = useRef<number>();

  const [totalLikes, setTotalLikes] = useState(() => {
    return props.edition.likes ? props.edition.likes.total : 0;
  });
  const [userLikes, setUserLikes] = useState(() => {
    if (!props.edition.likes) return 0;
    const user = props.edition.likes.likers.find(
      liker => liker.user.id === getLoggedUserId()
    );

    return user ? user.numOfLikes : 0;
  });
  const [showComments, setShowComments] = useState(props.showComments);
  useEffect(() => {
    setShowComments(props.showComments);
  }, [props.showComments]);
  const [showLikes, setShowLikes] = useState(false);
  // useEffect(() => {
  //   if (props.showAnswerEditor || props.showPositionEditor) {
  //     setShowComments(false);
  //     setShowLikes(false);
  //   }
  // }, [props.showAnswerEditor, props.showPositionEditor]);
  const [numOfComments, setNumOfComments] = useState(() => {
    const { comments: cments } = props.edition!;
    return cments ? cments.length : 0;
  });

  const onClickLike = async () => {
    if (userLikes === 20) {
      toast.error("Max 20 likes per edition");
      return;
    }

    const newUserLikes = userLikes + 1;
    const newTotalLikes = totalLikes + 1;
    setUserLikes(newUserLikes);
    setTotalLikes(newTotalLikes);
    cancelPrevWait();
    await wait(500);
    /* because the user can click multiple times in a row, creating too many sequential requests to the server */
    const variables: LikeAnswerEditionVariables = {
      answerId: props.answerId,
      answerEditionId: props.edition.id,
      userLikes: newUserLikes
    };
    await props.likeEdition({ variables });
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

  return (
    <>
      <Viewer>- {answerWithParagraphs}</Viewer>
      <Row
        hide=/* {!hovered} */ {
          // props.showAnswerEditor || props.showPositionEditor
          false
        }
      >
        <LikeBtn onClick={onClickLike} isLiked={totalLikes > 0} />
        <SmallBtn onClick={toggleLikes}>{numofLikesText}</SmallBtn>
        <SmallBtn onClick={toggleComments}>{numOfCommentsText}</SmallBtn>
      </Row>
      {showLikes && <Likes onClose={toggleLikes} likes={props.edition.likes} />}
      {(props.scrollToComment || showComments) && (
        <Comments
          comments={props.edition.comments}
          answerId={props.answerId}
          answerEditionId={props.edition.id}
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
};

export default Edition;
