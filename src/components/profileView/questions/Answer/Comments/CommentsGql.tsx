import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import {
  COMMENT_ANSWER,
  EDIT_COMMENT,
  REMOVE_COMMENT
} from "GqlClient/question/answer/comment/mutations";

interface CommentsGqlProps {
  children: (
    commentAnswer: MutationFn,
    editComment: MutationFn,
    removeComment: MutationFn
  ) => any;
}

const CommentsGql = (props: CommentsGqlProps) => {
  const { children } = props;

  return (
    <Mutation mutation={COMMENT_ANSWER}>
      {commentAnswer => {
        return (
          <Mutation mutation={EDIT_COMMENT}>
            {editComment => {
              return (
                <Mutation mutation={REMOVE_COMMENT}>
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
