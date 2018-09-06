import gql from 'graphql-tag';
import { NotificationFields, QuestionFields } from 'Fragments';

export const GET_ANSWER_QUESTION = gql``;

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
