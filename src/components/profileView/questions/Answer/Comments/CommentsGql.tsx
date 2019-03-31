import React, { ReactNode } from "react";
import { Mutation, MutationFn, Query, ApolloConsumer } from "react-apollo";
import {
  COMMENT_ANSWER_EDITION,
  EDIT_COMMENT,
  REMOVE_COMMENT
} from "GqlClient/question/answer/comment/mutations";
import {
  CommentAnswerEditionMutation,
  CommentAnswerEditionMutationVariables,
  EditCommentMutation,
  EditCommentMutationVariables,
  RemoveCommentMutation,
  RemoveCommentMutationVariables,
  UsersQuery,
  UsersQueryVariables,
  UserFieldsFragment
} from "GqlClient/autoGenTypes";
import { GET_USERS } from "GqlClient/user/queries";

type CommentsGqlProps = {
  children: (
    commentAnswer: MutationFn<
      CommentAnswerEditionMutation,
      CommentAnswerEditionMutationVariables
    >,
    editComment: MutationFn<EditCommentMutation, EditCommentMutationVariables>,
    removeComment: MutationFn<
      RemoveCommentMutation,
      RemoveCommentMutationVariables
    >,
    searchUsers: (
      variables: UsersQueryVariables
    ) => Promise<UserFieldsFragment[] | null>
  ) => React.ReactElement;
};

const CommentsGql = (props: CommentsGqlProps) => {
  const { children } = props;

  return (
    <Mutation<
      CommentAnswerEditionMutation,
      CommentAnswerEditionMutationVariables
    >
      mutation={COMMENT_ANSWER_EDITION}
    >
      {commentAnswerEdition => {
        return (
          <Mutation<EditCommentMutation, EditCommentMutationVariables>
            mutation={EDIT_COMMENT}
          >
            {editComment => {
              return (
                <Mutation<RemoveCommentMutation, RemoveCommentMutationVariables>
                  mutation={REMOVE_COMMENT}
                >
                  {removeComment => {
                    return (
                      <ApolloConsumer>
                        {client => {
                          const searchUsers = async (
                            variables: UsersQueryVariables
                          ) => {
                            const res = await client.query<
                              UsersQuery,
                              UsersQueryVariables
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
