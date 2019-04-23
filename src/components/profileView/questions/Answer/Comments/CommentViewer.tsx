import React, { useRef, useState } from "react";
import styled from "styled-components";
import TextWithMentions from "Reusable/TextWithMentions";
import Anchor from "Reusable/Anchor";
import { Row } from "../../Row";
import LikeBtn from "../LikeBtn";
import { toast } from "react-toastify";
import {
  LikeCommentMutationVariables,
  LikesFieldsFragment,
  CommentFieldsFragment,
  LikeCommentMutation
} from "GqlClient/autoGenTypes";
import { getLoggedUserId } from "Utils";
import { MutationFn } from "react-apollo";
import CommentLikes from "./CommentLikes";

const StyledViewer = styled.p`
  word-break: break-all;
  white-space: normal;
  text-align: left;
`;

const SmallBtn = styled(Anchor)`
  margin-right: 0.6em;
`;

type CommentViewerProps = {
  comment: CommentFieldsFragment;
  onClickLike: () => any;
  likes: CommentFieldsFragment["likes"];
  // answerId: string;
  // editionId: string;
  // likeComment: MutationFn<LikeCommentMutation, LikeCommentMutationVariables>;
};

const CommentViewer = ({ likes, comment, onClickLike }: CommentViewerProps) => {
  const [showLikes, setShowLikes] = useState(false);

  const toggleLikes = () => {
    setShowLikes(!showLikes);
  };
  let numofLikesText: string;
  if (likes) {
    numofLikesText = likes.total === 1 ? "1 Like" : `${likes.total} Likes`;
  } else {
    numofLikesText = `0 Likes`;
  }

  return (
    <>
      <StyledViewer>
        - <TextWithMentions text={comment.value} />
      </StyledViewer>
      <Row
        hide=/* {!hovered} */ {
          // props.showAnswerEditor || props.showPositionEditor
          false
        }
      >
        <LikeBtn onClick={onClickLike} isLiked={!!likes && likes.total > 0} />
        <SmallBtn onClick={toggleLikes}>{numofLikesText}</SmallBtn>
      </Row>
      {showLikes && <CommentLikes onClose={toggleLikes} likes={likes} />}
    </>
  );
};

export default CommentViewer;
