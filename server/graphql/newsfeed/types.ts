import { User } from "../user/types";
import { Question } from "../question/types";

export type News = AnswerNews | CommentNews | NewFollowerNews | NewLikeNews;

export enum NewsType {
  NewAnswer = "NEW_ANSWER",
  NewAnswerEdition = "NEW_ANSWER_EDITION",
  NewComment = "NEW_COMMENT",
  NewLike = "NEW_LIKE",
  NewFollower = "NEW_FOLLOWER"
}

export interface NewsBase {
  type: NewsType;

  performer: User;

  createdOn: Date;
}

export interface AnswerNews extends NewsBase {
  type: NewsType;

  performer: User;

  answerOwner: User;

  question: Question;

  createdOn: Date;
}

export interface CommentNews extends NewsBase {
  type: NewsType;

  performer: User;

  answerOwner: User;

  question: Question;

  commentId: string;

  createdOn: Date;
}

export interface NewFollowerNews extends NewsBase {
  type: NewsType;

  performer: User;

  followedUser: User;

  createdOn: Date;
}

export interface NewLikeNews extends NewsBase {
  type: NewsType;

  performer: User;

  answerOwner: User;

  question: Question;

  createdOn: Date;
}
