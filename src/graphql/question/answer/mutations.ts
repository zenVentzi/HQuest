import gql from "graphql-tag";
import {
  CommentFields,
  AnswerFields,
  EditionFields
} from "GqlClient/fragments";

export const MOVE_ANSWER_POSITION = gql`
  mutation moveAnswerPosition($position: Int!, $answerId: ID!) {
    moveAnswerPosition(position: $position, answerId: $answerId)
  }
`;

export const ADD_ANSWER = gql`
  mutation addAnswer(
    $questionId: ID!
    $answerValue: String!
    $mentionedUsers: [ID!]
  ) {
    addAnswer(
      questionId: $questionId
      answerValue: $answerValue
      mentionedUsers: $mentionedUsers
    ) {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;

export const EDIT_ANSWER = gql`
  mutation editAnswer(
    $answerId: ID!
    $answerValue: String!
    $mentionedUsers: [ID!]
  ) {
    editAnswer(
      answerId: $answerId
      answerValue: $answerValue
      mentionedUsers: $mentionedUsers
    ) {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;

export const REMOVE_ANSWER = gql`
  mutation removeAnswer($answerId: ID!) {
    removeAnswer(answerId: $answerId) {
      ...AnswerFields
    }
  }
  ${AnswerFields}
`;
export const LIKE_ANSWER_EDITION = gql`
  mutation likeAnswerEdition(
    $answerId: ID!
    $answerEditionId: ID!
    $userLikes: Int!
  ) {
    likeAnswerEdition(
      answerId: $answerId
      answerEditionId: $answerEditionId
      userLikes: $userLikes
    ) {
      ...EditionFields
    }
  }
  ${EditionFields}
`;
