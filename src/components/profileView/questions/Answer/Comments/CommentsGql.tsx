import React, { ReactNode } from "react";
import { Mutation, MutationFn } from "react-apollo";
import {
  COMMENT_ANSWER_EDITION,
  EDIT_COMMENT,
  REMOVE_COMMENT
} from "GqlClient/question/answer/comment/mutations";
import {
  CommentAnswerMutation,
  CommentAnswerVariables,
  EditCommentMutation,
  EditCommentVariables,
  RemoveCommentMutation,
  RemoveCommentVariables
} from "GqlClient/autoGenTypes";

interface CommentsGqlProps {
  children: (
    commentAnswer: MutationFn<CommentAnswerMutation, CommentAnswerVariables>,
    editComment: MutationFn<EditCommentMutation, EditCommentVariables>,
    removeComment: MutationFn<RemoveCommentMutation, RemoveCommentVariables>
  ) => ReactNode;
}

const CommentsGql = (props: CommentsGqlProps) => {
  const { children } = props;

  return (
    <Mutation<CommentAnswerMutation, CommentAnswerVariables>
      mutation={COMMENT_ANSWER_EDITION}
    >
      {commentAnswer => {
        return (
          <Mutation<EditCommentMutation, EditCommentVariables>
            mutation={EDIT_COMMENT}
          >
            {editComment => {
              return (
                <Mutation<RemoveCommentMutation, RemoveCommentVariables>
                  mutation={REMOVE_COMMENT}
                >
                  {removeComment => {
                    return children(commentAnswer, editComment, removeComment);
                  }}
                </Mutation>
              );
            }}
          </Mutation>
        );
      }}
    </Mutation>
  );
};

export default CommentsGql;
