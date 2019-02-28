import gql from "graphql-tag";
import {
  NotificationFields,
  QuestionFields,
  QuestionConnectionFields,
  CommentFields,
  UserFields,
  AnswerFields
} from "graphql/gqlFragments";

export const GET_NOTIFICATIONS = gql`
  query notifications {
    notifications {
      ...NotificationFields
    }
  }
  ${NotificationFields}
`;
