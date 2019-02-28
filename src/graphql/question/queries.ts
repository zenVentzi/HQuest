import gql from "graphql-tag";
import {
  NotificationFields,
  QuestionFields,
  QuestionConnectionFields,
  CommentFields,
  UserFields,
  AnswerFields
} from "GqlClient/fragments";

export const GET_ANSWERED_QUESTION = gql`
  query answeredQuestion($userId: ID!, $questionId: ID!) {
    answeredQuestion(userId: $userId, questionId: $questionId) {
      ...QuestionFields
      answer {
        ...AnswerFields
      }
    }
  }
  ${QuestionFields}
  ${AnswerFields}
`;

export const GET_QUESTIONS = gql`
  query questions(
    $answered: Boolean!
    $userId: ID!
    $tags: [String!]
    $first: Int!
    $after: String
  ) {
    questions(
      answered: $answered
      userId: $userId
      tags: $tags
      first: $first
      after: $after
    ) {
      ...QuestionConnectionFields
    }
  }
  ${QuestionConnectionFields}
`;

export const GET_QUESTIONS_TAGS = gql`
  query questionsTags {
    questionsTags
  }
`;
