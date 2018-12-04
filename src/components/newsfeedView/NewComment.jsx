/* 

props: { performer, receiver, question, commentId}

*/

import React, { Fragment } from 'react';
import distanceInWords from 'date-fns/distance_in_words';
import styled from 'styled-components';
import User from 'Reusable/UserRow';
import { NewsType } from 'Constants';
import AnsweredQuestion from '../profileView/questions/AnsweredQuestion';

const { NEW_ANSWER_EDITION, NEW_ANSWER } = NewsType;

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

const getTime = createdOn => {
  const startDate = new Date(createdOn).getTime();
  const dateTimeNow = new Date().getTime();

  const res = distanceInWords(startDate, dateTimeNow, {
    includeSeconds: true,
  });

  return `${res} ago`;
};

const NewComment = ({
  news: { performer, answerOwner, question, commentId, createdOn },
}) => {
  let topText;
  let bottomText;
  const doesOwnAnswer = answerOwner.id === performer.id;

  if (doesOwnAnswer) {
    topText = `Commented their answer ${getTime(createdOn)} `;
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
        {!doesOwnAnswer && (
          <Fragment>
            <User user={answerOwner} size={1.5} />
            <HeaderText>{bottomText}</HeaderText>
          </Fragment>
        )}
      </Header>
      <Body>
        <AnsweredQuestion scrollToComment={commentId} question={question} />
      </Body>
    </NewCommentWrapper>
  );
};

export default NewComment;
