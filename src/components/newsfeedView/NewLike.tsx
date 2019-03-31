/* 

Problem: how do we create like news? For example, a user can give 2 likes now
then after 10 minutes 2 more etc.

Exaplain the process from user liking an answer to coming to the newsfeed of another user:
Upon even 1 like, the followers get news that this user has liked an answer.
The followers don't get any more news if the user "likes the answer some more later". Only the initial
likes get into the newsfeed of the user's followers. Somewhat of a solution could be to update
the news number of likes if the user likes the answer more later. Do we show the numOfLikes in newsfeed?
It's simpler not to. What is the cost, timewise, of implementing the numofLikes for newsfeed?

Strive for multiple likes. If too time consuming, go for single like news 


User liked x20 User1's answer
  */

/* 

props: { performer, receiver, question, commentId}

*/

import React, { Fragment } from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import { getLoggedUserId } from "Utils";
import AnsweredQuestion from "../profileView/questions/AnsweredQuestion";
import { getTime } from ".";
import { NewLikeNewsFieldsFragment, NewsBase } from "GqlClient/autoGenTypes";

// this file is duplication of NewComment. To be fixed.
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

interface NewLikeProps {
  news: NewLikeNewsFieldsFragment & NewsBase;
}

const NewLike = ({
  news: { performer, answerOwner, question, createdOn }
}: NewLikeProps) => {
  let topText;
  let bottomText;
  // improve the 2 names below
  const isPerformerOwnAnswer = answerOwner.id === performer.id;
  const isLoggedUserAnwer = answerOwner.id === getLoggedUserId();

  if (isPerformerOwnAnswer) {
    topText = `Liked their answer ${getTime(createdOn)} `;
    bottomText = null;
  } else if (isLoggedUserAnwer) {
    topText = `Liked your answer ${getTime(createdOn)} `;
    bottomText = null;
  } else {
    topText = `Liked`;
    bottomText = `answer ${getTime(createdOn)}`;
  }

  return (
    <NewLikeWrapper>
      <Header>
        <User user={performer} size={1.5} />
        <HeaderText>{topText}</HeaderText>
        {!isPerformerOwnAnswer && !isLoggedUserAnwer && (
          <Fragment>
            <User user={answerOwner} size={1.5} />
            <HeaderText>{bottomText}</HeaderText>
          </Fragment>
        )}
      </Header>
      <Body>
        <AnsweredQuestion
          question={question}
          isPersonal={false}
          showComments={false}
          totalQuestionsCount={0} /* TODO: Fix the hardcoded values */
        />
      </Body>
    </NewLikeWrapper>
  );
};

export default NewLike;
