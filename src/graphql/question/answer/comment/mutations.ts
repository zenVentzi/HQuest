import gql from "graphql-tag";
import {
  QuestionFields,
  CommentFields,
  AnswerFields
} from "graphql/gqlFragments";

// TODO return either Answer or Comment
export const COMMENT_ANSWER = gql`
  mutation commentAnswer($answerId: ID!, $comment: String!) {
    commentAnswer(answerId: $answerId, comment: $comment) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;

export const EDIT_COMMENT = gql`
  mutation editComment(
    $answerId: ID!
    $commentId: ID!
    $commentValue: String!
  ) {
    editComment(
      answerId: $answerId
      commentId: $commentId
      commentValue: $commentValue
    ) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($answerId: ID!, $commentId: ID!) {
    removeComment(answerId: $answerId, commentId: $commentId) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;
