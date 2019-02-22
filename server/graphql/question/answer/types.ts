import { Resolver } from "../../global/types";
import { User } from "../../user/types";
import { Comment } from "./comment/types";
import { ApolloContext } from "gqlContext";

export interface Answer {
  id: string;

  userId: string;

  questionId: string;

  value: string;

  comments?: Comment[] | null;

  likes?: Likes | null;

  editions?: AnswerEdition[] | null;

  position: number;
}

export interface Likes {
  total: number;

  likers?: Liker[] | null;
}

export interface Liker {
  user: User;

  numOfLikes: number;
}

export interface AnswerEdition {
  id: string;

  date: Date;

  before: string;

  after: string;
}

// export interface Query {}

interface EditAnswerArgs {
  answerId: string;
  answerValue: string;
}

interface AddAnswerArgs {
  questionId: string;
  answerValue: string;
}

interface RemoveAnswerArgs {
  answerId: string;
}

interface LikeAnswerArgs {
  answerId: string;
  userLikes: number;
}

interface MoveAnswerPositionArgs {
  answerId: string;
  position: number;
}

export interface Mutation {
  editAnswer: Resolver<{}, EditAnswerArgs, ApolloContext, Answer>;
  addAnswer: Resolver<{}, AddAnswerArgs, ApolloContext, Answer>;
  removeAnswer: Resolver<{}, RemoveAnswerArgs, ApolloContext, Answer>;
  likeAnswer: Resolver<{}, LikeAnswerArgs, ApolloContext, Answer>;
  moveAnswerPosition: Resolver<
    {},
    MoveAnswerPositionArgs,
    ApolloContext,
    number
  >;
}
