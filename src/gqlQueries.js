import gql from 'graphql-tag';
import { NotificationFields } from 'Fragments';

export const a = 5;

export const GET_QUESTIONS = gql`
  query questions($userId: ID!, $all: Boolean!) {
    questions(userId: $userId, all: $all) {
      answered {
        ...questionFields
        answer {
          id
          value
        }
      }
      unanswered @include(if: $all) {
        ...questionFields
      }
    }
  }

  fragment questionFields on Question {
    id
    question
    type
    possibleAnswers
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
