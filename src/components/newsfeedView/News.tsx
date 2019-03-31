import React from "react";
// import { NewsType } from "Constants";
import Answer from "./Answer";
import NewComment from "./NewComment";
import NewFollower from "./NewFollower";
import NewLike from "./NewLike";
import { NewsBase, NewsType } from "GqlClient/autoGenTypes";

interface NewsProps {
  news: NewsBase;
}

const News = ({ news }: NewsProps) => {
  let NewsComponent;

  switch (news.type) {
    case NewsType.NewAnswer:
    case NewsType.NewAnswerEdition:
      NewsComponent = Answer;
      break;
    case NewsType.NewComment:
      NewsComponent = NewComment;
      break;
    case NewsType.NewFollower:
      NewsComponent = NewFollower;
      break;
    case NewsType.NewLike:
      NewsComponent = NewLike;
      break;
    default:
      break;
  }

  return <NewsComponent news={news} />;
};

export default News;
