import { Resolver } from "../../../global/types";
import { User } from "../../../user/types";
import { ApolloContext } from "gqlContext";

export interface Comment {
  id: string;
  user: User;
  value: string;
}

interface CommentAnswerArgs {
  answerId: string;
  comment: string;
}

interface EditCommentArgs {
  answerId: string;
  commentId: string;
  commentValue: string;
}

interface RemoveCommentArgs {
  answerId: string;
  commentId: string;
}

export interface Mutation {
  commentAnswer: Resolver<{}, CommentAnswerArgs, ApolloContext, Comment>;
  editComment: Resolver<{}, EditCommentArgs, ApolloContext, Comment>;
  removeComment: Resolver<{}, RemoveCommentArgs, ApolloContext, Comment>;
}
