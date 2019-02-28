import React, { Fragment } from "react";
import distanceInWords from "date-fns/distance_in_words";
import styled from "styled-components";
import User from "Reusable/UserRow";
import { getLoggedUserId } from "Utils";
import AnsweredQuestion from "../profileView/questions/AnsweredQuestion";
import { getTime } from ".";

const NewCommentWrapper = styled.div`
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

interface NewCommentProps {
  news: any;
}

const NewComment = ({
  news: { performer, answerOwner, question, commentId, createdOn }
}: NewCommentProps) => {
  let topText;
  let bottomText;
  // improve the 2 names below
  const doesOwnAnswer = answerOwner.id === performer.id;
  const isLoggedUserAnwer = answerOwner.id === getLoggedUserId();

  if (doesOwnAnswer) {
    topText = `Commented their answer ${getTime(createdOn)} `;
    bottomText = null;
  } else if (isLoggedUserAnwer) {
    topText = `Commented your answer ${getTime(createdOn)} `;
    bottomText = null;
  } else {
    topText = `commented on`;
    bottomText = `answer ${getTime(createdOn)}`;
  }

  return (
    <NewCommentWrapper>
      <Header>
        <User user={performer} size={1.5} />
        <HeaderText>{topText}</HeaderText>
        {!doesOwnAnswer && !isLoggedUserAnwer && (
          <Fragment>
            <User user={answerOwner} size={1.5} />
            <HeaderText>{bottomText}</HeaderText>
          </Fragment>
        )}
      </Header>
      <Body>
        <AnsweredQuestion
          scrollToComment={commentId}
          question={question}
          totalQuestionsCount={0}
          isPersonal={false}
          showComments={false}
          // TODO fix hardcoded values
        />
      </Body>
    </NewCommentWrapper>
  );
};

export default NewComment;
