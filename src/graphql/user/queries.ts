import gql from "graphql-tag";
import {
  NotificationFields,
  QuestionFields,
  QuestionConnectionFields,
  CommentFields,
  UserFields,
  AnswerFields
} from "GqlClient/fragments";

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
