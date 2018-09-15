import gql from 'graphql-tag';
import {
  NotificationFields,
  QuestionFields,
  QuestionConnectionFields,
} from 'Fragments';

export const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      fullName
      avatarSrc
      intro
      socialMediaLinks {
        facebookLink
        twitterLink
        instagramLink
        linkedInLink
      }
      me
      followers
      following
    }
  }
`;

export const GET_USERS = gql`
  query users($match: String) {
    users(match: $match) {
      id
      fullName
      avatarSrc
      intro
    }
  }
`;

export const GET_FOLLOWERS = gql`
  query followers($userId: ID!) {
    followers(userId: $userId) {
      id
      fullName
      avatarSrc
      intro
    }
  }
`;
export const GET_FOLLOWING = gql`
  query following($userId: ID!) {
    following(userId: $userId) {
      id
      fullName
      avatarSrc
      intro
    }
  }
`;

export const GET_ANSWERED_QUESTION = gql`
  query answeredQuestion($userId: ID!, $questionId: ID!) {
    answeredQuestion(userId: $userId, questionId: $questionId) {
      ...QuestionFields
      answer {
        id
        value
        numOfComments
      }
    }
  }
  ${QuestionFields}
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

// export const GET_UNANSWERED_QUESTIONS = gql`
//   query questions(
//     $userId: ID!
//     $tags: [String]
//     $first: Int!
//     $after: String!
//   ) {
//     questions(
//       userId: $userId
//       tags: $tags
//       answered: false
//       first: $first
//       after: $after
//     ) {
//       ...QuestionFields
//     }
//   }
//   ${QuestionFields}
// `;

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
