import React from 'react';
import styled from 'styled-components';
import { NewsType } from 'Constants';
import NewAnswer from './NewAnswer';
import NewComment from './NewComment';
import NewEdition from './NewQuestionEdition';
import NewFollower from './NewFollower';
import NewLike from './NewLike';

const {
  NEW_COMMENT,
  NEW_ANSWER,
  NEW_LIKE,
  NEW_FOLLOWER,
  NEW_EDITION,
} = NewsType;

const News = ({ news }) => {
  let NewsComponent;

  switch (news.type) {
    case NEW_ANSWER:
      NewsComponent = <NewAnswer news={news} />;
      break;
    case NEW_COMMENT:
      NewsComponent = <NewComment />;
      break;
    case NEW_EDITION:
      NewsComponent = <NewEdition />;
      break;
    case NEW_FOLLOWER:
      NewsComponent = <NewFollower />;
      break;
    case NEW_LIKE:
      NewsComponent = <NewLike />;
      break;
    default:
      break;
  }
  return NewsComponent;
};

export default News;
