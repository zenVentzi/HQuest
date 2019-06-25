import React from "react";
// import { NewsType } from "Constants";
import Answer from "./Answer";
import NewComment from "./NewComment";
import NewFollower from "./NewFollower";
import Like from "./Like";
import { NewsBase, NewsType } from "GqlClient/autoGenTypes";

interface NewsProps {
  news: Pick<NewsBase, "type">;
}

const News = ({ news }: NewsProps) => {
  let NewsComponent;

  switch (news.type) {
    case NewsType.NewAnswerEdition:
      NewsComponent = Answer;
      break;
    case NewsType.NewComment:
      NewsComponent = NewComment;
      break;
    case NewsType.NewFollower:
      NewsComponent = NewFollower;
      break;
    case NewsType.EditionLike:
    case NewsType.CommentLike:
      NewsComponent = Like;
      break;
    default:
      break;
  }

  return <NewsComponent news={news} />;
};

export default News;
