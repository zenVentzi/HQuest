import React, { ReactNode } from "react";
import { Mutation, MutationFn, Query, ApolloConsumer } from "react-apollo";
import {
  COMMENT_ANSWER_EDITION,
  EDIT_COMMENT,
  REMOVE_COMMENT
} from "GqlClient/question/answer/comment/mutations";
import {
  CommentAnswerEditionMutation,
  CommentAnswerEditionVariables,
  EditCommentMutation,
  EditCommentVariables,
  RemoveCommentMutation,
  RemoveCommentVariables,
  UsersQuery,
  UsersVariables,
  UserFieldsFragment
} from "GqlClient/autoGenTypes";
import { GET_USERS } from "GqlClient/user/queries";

type CommentsGqlProps = {
  children: (
    commentAnswer: MutationFn<
      CommentAnswerEditionMutation,
      CommentAnswerEditionVariables
    >,
    editComment: MutationFn<EditCommentMutation, EditCommentVariables>,
    removeComment: MutationFn<RemoveCommentMutation, RemoveCommentVariables>,
    searchUsers: (
      variables: UsersVariables
    ) => Promise<UserFieldsFragment[] | null>
  ) => React.ReactElement;
};

const CommentsGql = (props: CommentsGqlProps) => {
  const { children } = props;

  return (
    <Mutation<CommentAnswerEditionMutation, CommentAnswerEditionVariables>
      mutation={COMMENT_ANSWER_EDITION}
    >
      {commentAnswerEdition => {
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
                    return (
                      <ApolloConsumer>
                        {client => {
                          const searchUsers = async (
                            variables: UsersVariables
                          ) => {
                            const res = await client.query<
                              UsersQuery,
                              UsersVariables
                            >({ query: GET_USERS, variables });
                            return res.data.users;
                          };
                          return children(
                            commentAnswerEdition,
                            editComment,
                            removeComment,
                            searchUsers
                          );
                        }}
                      </ApolloConsumer>
                    );
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
