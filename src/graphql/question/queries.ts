import gql from "graphql-tag";
import {
  NotificationFields,
  AnsweredQuestionFields,
  AnsweredQuestionConnectionFields,
  UnansweredQuestionConnectionFields,
  CommentFields,
  UserFields,
  AnswerFields
} from "GqlClient/fragments";

export const GET_ANSWERED_QUESTION = gql`
  query answeredQuestion($userId: ID!, $questionId: ID!) {
    answeredQuestion(userId: $userId, questionId: $questionId) {
      ...AnsweredQuestionFields
      # answer { TODO make sure this is not needed
      #   ...AnswerFields
      # }
    }
  }
  ${AnsweredQuestionFields}
`;

export const GET_UNANSWERED_QUESTIONS = gql`
  query unansweredQuestions(
    $userId: ID!
    $tags: [String!]
    $first: Int!
    $after: String
  ) {
    unansweredQuestions(
      userId: $userId
      tags: $tags
      first: $first
      after: $after
    ) {
      ...UnansweredQuestionConnectionFields
    }
  }
  ${UnansweredQuestionConnectionFields}
`;

export const GET_ANSWERED_QUESTIONS = gql`
  query answeredQuestions(
    $userId: ID!
    $tags: [String!]
    $first: Int!
    $after: String
  ) {
    answeredQuestions(
      userId: $userId
      tags: $tags
      first: $first
      after: $after
    ) {
      ...AnsweredQuestionConnectionFields
    }
  }
  ${AnsweredQuestionConnectionFields}
`;

export const GET_QUESTIONS_TAGS = gql`
  query questionsTags {
    questionsTags
  }
`;
