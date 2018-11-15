import gql from 'graphql-tag';
import {
  NotificationFields,
  QuestionFields,
  QuestionConnectionFields,
  CommentFields,
  UserFields,
  AnswerFields,
} from 'Fragments';

export const GET_NEWSFEED = gql`
  query newsfeed {
    newsfeed {
      type
      createdOn
      ... on AnswerNews {
        performer {
          ...UserFields
        }
        question {
          ...QuestionFields
        }
      }
    }
  }
  ${UserFields}
  ${QuestionFields}
`;

export const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${UserFields}
`;

export const GET_USERS = gql`
  query users($match: String) {
    users(match: $match) {
      ...UserFields
    }
  }
  ${UserFields}
`;

export const GET_FOLLOWERS = gql`
  query followers($userId: ID!) {
    followers(userId: $userId) {
      ...UserFields
    }
  }
  ${UserFields}
`;
export const GET_FOLLOWING = gql`
  query following($userId: ID!) {
    following(userId: $userId) {
      ...UserFields
    }
  }
  ${UserFields}
`;

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
    $tags: [String]
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

export const GET_NOTIFICATIONS = gql`
  query notifications {
    notifications {
      ...NotificationFields
    }
  }
  ${NotificationFields}
`;

export const GET_COMMENTS = gql`
  query comments($answerId: ID!) {
    comments(answerId: $answerId) {
      ...CommentFields
    }
  }
  ${CommentFields}
`;
