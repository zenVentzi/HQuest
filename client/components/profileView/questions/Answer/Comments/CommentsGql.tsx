import React, { ReactNode, useContext } from "react";
import deepClone from "clone";
import deep_diff from "deep-diff";
import { Mutation, MutationFn, Query, ApolloConsumer } from "react-apollo";
import {
  COMMENT_ANSWER_EDITION,
  EDIT_COMMENT,
  REMOVE_COMMENT,
  LIKE_COMMENT
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
  UserFieldsFragment,
  // AnsweredQuestion,
  LikeCommentMutation,
  LikeCommentMutationVariables
} from "GqlClient/autoGenTypes";
import { GET_USERS } from "GqlClient/user/queries";
import { AnsweredQuestionContext } from "../../AnsweredQuestion";
import { EditionContext } from "../Edition";
import {
  AnsweredQuestionFields,
  AnsweredQuestionFieldsFragmentName
} from "GqlClient/fragments";

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
    likeComment: MutationFn<LikeCommentMutation, LikeCommentMutationVariables>,
    searchUsers: (
      variables: UsersQueryVariables
    ) => Promise<UserFieldsFragment[] | null>
  ) => React.ReactElement;
};

const CommentsGql = (props: CommentsGqlProps) => {
  const { children } = props;
  const answeredQuestion = useContext(AnsweredQuestionContext);
  const edition = useContext(EditionContext);

  if (!answeredQuestion) {
    throw Error(`asnwer cannot be null|undefined`);
  } else if (!edition) {
    throw Error(`edition cannot be null|undefined`);
  }

  return (
    <Mutation<
      CommentAnswerEditionMutation,
      CommentAnswerEditionMutationVariables
    >
      mutation={COMMENT_ANSWER_EDITION}
      update={(cache, { data }) => {
        if (!data) {
          throw Error(`data must not be null`);
        }
        const addedComment = data.commentAnswerEdition;

        const questionWithUpdatedComments = deepClone(answeredQuestion);

        questionWithUpdatedComments.answer.editions.forEach(ed => {
          if (ed.id === edition.id) {
            if (!ed.comments) {
              ed.comments = [addedComment];
            } else {
              ed.comments.push(addedComment);
            }
          }
        });

        cache.writeFragment({
          fragment: AnsweredQuestionFields,
          data: questionWithUpdatedComments,
          id: `${questionWithUpdatedComments.__typename}:${
            questionWithUpdatedComments.id
          }`,
          fragmentName: AnsweredQuestionFieldsFragmentName
        });
      }}
    >
      {commentAnswerEdition => {
        return (
          <Mutation<EditCommentMutation, EditCommentMutationVariables>
            mutation={EDIT_COMMENT} // TODO add update function
          >
            {editComment => {
              return (
                <Mutation<RemoveCommentMutation, RemoveCommentMutationVariables>
                  mutation={REMOVE_COMMENT}
                  update={(cache, { data }) => {
                    if (!data) {
                      throw Error(`data must not be null`);
                    }
                    const removedComment = data.removeComment;

                    const questionWithUpdatedComments = deepClone(
                      answeredQuestion
                    );

                    questionWithUpdatedComments.answer.editions.forEach(ed => {
                      if (ed.id === edition.id) {
                        ed.comments = ed.comments!.filter(
                          com => com.id !== removedComment.id
                        );
                      }
                    });

                    cache.writeFragment({
                      fragment: AnsweredQuestionFields,
                      data: questionWithUpdatedComments,
                      id: `${questionWithUpdatedComments.__typename}:${
                        questionWithUpdatedComments.id
                      }`,
                      fragmentName: AnsweredQuestionFieldsFragmentName
                    });
                  }}
                >
                  {removeComment => {
                    return (
                      <Mutation<
                        LikeCommentMutation,
                        LikeCommentMutationVariables
                      >
                        mutation={LIKE_COMMENT}
                      >
                        {likeComment => {
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
                                  likeComment,
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
      }}
    </Mutation>
  );
};

export default CommentsGql;
