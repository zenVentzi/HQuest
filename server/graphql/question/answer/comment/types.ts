import { Resolver } from "../../../global/types";
import { User } from "../../../user/types";
import { ApolloContext } from "gqlContext";

export interface Comment {
  id: string;
  user: User;
  value: string;
}

interface CommentAnswerEditionArgs {
  answerId: string;
  answerEditionId: string;
  comment: string;
}

interface EditCommentArgs {
  answerId: string;
  answerEditionId: string;
  commentId: string;
  commentValue: string;
}

interface RemoveCommentArgs {
  answerId: string;
  answerEditionId: string;
  commentId: string;
}

export interface Mutation {
  commentAnswerEdition: Resolver<
    {},
    CommentAnswerEditionArgs,
    ApolloContext,
    Comment
  >;
  editComment: Resolver<{}, EditCommentArgs, ApolloContext, Comment>;
  removeComment: Resolver<{}, RemoveCommentArgs, ApolloContext, Comment>;
}
