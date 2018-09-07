import gql from 'graphql-tag';
import { NotificationFields, QuestionFields } from 'Fragments';

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

export const GET_ANSWERED_QUESTIONS = gql`
  query questions($userId: ID!) {
    questions(userId: $userId, answered: true) {
      ...QuestionFields
      answer {
        id
        value
      }
    }
  }
  ${QuestionFields}
`;

export const GET_UNANSWERED_QUESTIONS = gql`
  query questions($userId: ID!) {
    questions(userId: $userId, answered: false) {
      ...QuestionFields
    }
  }
  ${QuestionFields}
`;

export const GET_NOTIFICATIONS = gql`
  query notifications {
    notifications {
      ...NotificationFields
    }
  }
  ${NotificationFields}
`;
