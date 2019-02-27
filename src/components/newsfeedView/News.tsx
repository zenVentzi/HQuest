import React from "react";
import { NewsType } from "Constants";
import Answer from "./Answer";
import NewComment from "./NewComment";
import NewFollower from "./NewFollower";
import NewLike from "./NewLike";

const {
  NEW_ANSWER_EDITION,
  NEW_ANSWER,
  NEW_COMMENT,
  NEW_LIKE,
  NEW_FOLLOWER
} = NewsType;

interface NewsProps {
  news: any;
}

const News = ({ news }: NewsProps) => {
  let NewsComponent;

  switch (news.type) {
    case NEW_ANSWER:
    case NEW_ANSWER_EDITION:
      NewsComponent = Answer;
      break;
    case NEW_COMMENT:
      NewsComponent = NewComment;
      break;
    case NEW_FOLLOWER:
      NewsComponent = NewFollower;
      break;
    case NEW_LIKE:
      NewsComponent = NewLike;
      break;
    default:
      break;
  }

  return <NewsComponent news={news} />;
};

export default News;
