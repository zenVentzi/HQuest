import React, { Fragment } from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import { getLoggedUserId } from "Utils";
import AnsweredQuestion from "../profileView/questions/AnsweredQuestion";
import { getTime } from ".";
import {
  EditionLikeNewsFieldsFragment,
  NewsBase,
  CommentLikeNewsFieldsFragment
} from "GqlClient/autoGenTypes";

// this file is somewhat a duplicate of NewComment. To be fixed.
const NewLikeWrapper = styled.div`
  width: 100%;
  margin-bottom: 1em;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1em;
  border-bottom: 2px solid white;
`;

const HeaderText = styled.div`
  /* flex-grow: 1; */
  font-size: 0.8em;
`;
const Body = styled.div``;

interface LikeProps {
  news: (EditionLikeNewsFieldsFragment | CommentLikeNewsFieldsFragment) &
    NewsBase;
}

const Like = ({ news }: LikeProps) => {
  let topText;
  let bottomText;
  // improve the 2 names below
  const performerOwnsAnswer = news.answerOwner.id === news.performer.id;
  const isLoggedUserAnwer = news.answerOwner.id === getLoggedUserId();
  const isCommentLike = !!(news as CommentLikeNewsFieldsFragment).commentId;
  const likedObject = isCommentLike ? "comment" : "edition";

  if (performerOwnsAnswer) {
    // this own dick sucking will not happen anymore
    // due to validation on the server
    topText = `Liked their ${likedObject} ${getTime(news.createdOn)} `;
    bottomText = null;
  } else if (isLoggedUserAnwer) {
    return null; // the user will have notification for that anyway
    topText = `Liked your ${likedObject} ${getTime(news.createdOn)} `;
    bottomText = null;
  } else {
    topText = `Liked`;
    bottomText = `${likedObject} ${getTime(news.createdOn)}`;
  }

  return (
    <NewLikeWrapper>
      <Header>
        <User user={news.performer} size={1.5} />
        <HeaderText>{topText}</HeaderText>
        {!performerOwnsAnswer && !isLoggedUserAnwer && (
          <Fragment>
            <User user={news.answerOwner} size={1.5} />
            <HeaderText>{bottomText}</HeaderText>
          </Fragment>
        )}
      </Header>
      <Body>
        <AnsweredQuestion
          question={news.question}
          editionId={news.editionId}
          isPersonal={false}
          showComments={isCommentLike}
          scrollToComment={(news as CommentLikeNewsFieldsFragment).commentId}
          totalQuestionsCount={0} /* TODO: Fix the hardcoded values */
        />
      </Body>
    </NewLikeWrapper>
  );
};

export default Like;
