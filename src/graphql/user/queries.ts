import gql from "graphql-tag";
import { UserFields } from "GqlClient/fragments";

export const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${UserFields}
`;

export const GET_USERS = gql`
  query Users($match: String) {
    users(match: $match) {
      ...UserFields
    }
  }
  ${UserFields}
`;

export const GET_RANKINGS = gql`
  query Rankings {
    rankings {
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
