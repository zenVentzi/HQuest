import gql from "graphql-tag";
import { CommentFields, AnswerFields } from "GqlClient/fragments";

// TODO return either Answer or Comment
export const COMMENT_ANSWER_EDITION = gql`
  mutation commentAnswerEdition(
    $answerId: ID!
    $answerEditionId: ID!
    $comment: String!
    $mentionedUsers: [ID!]
  ) {
    commentAnswerEdition(
      answerId: $answerId
      answerEditionId: $answerEditionId
      comment: $comment
      mentionedUsers: $mentionedUsers
    ) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;

export const EDIT_COMMENT = gql`
  mutation editComment(
    $answerId: ID!
    $answerEditionId: ID!
    $commentId: ID!
    $commentValue: String!
    $mentionedUsers: [ID!]
  ) {
    editComment(
      answerId: $answerId
      answerEditionId: $answerEditionId
      commentId: $commentId
      commentValue: $commentValue
      mentionedUsers: $mentionedUsers
    ) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment(
    $answerId: ID!
    $answerEditionId: ID!
    $commentId: ID!
  ) {
    removeComment(
      answerId: $answerId
      answerEditionId: $answerEditionId
      commentId: $commentId
    ) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;

export const LIKE_COMMENT = gql`
  mutation likeComment(
    $answerId: ID!
    $answerEditionId: ID!
    $commentId: ID!
    $userLikes: Int!
  ) {
    likeComment(
      answerId: $answerId
      answerEditionId: $answerEditionId
      commentId: $commentId
      userLikes: $userLikes
    ) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;
