import gql from "graphql-tag";
import {
  QuestionFields,
  CommentFields,
  AnswerFields
} from "GqlClient/fragments";

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
  ) {
    editComment(
      answerId: $answerId
      answerEditionId: $answerEditionId
      commentId: $commentId
      commentValue: $commentValue
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
