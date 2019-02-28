import gql from "graphql-tag";
import { NotificationFields } from "graphql/fragments";

export const NEW_NOTIFICATION = gql`
  subscription newNotification($userId: ID!) {
    newNotification(userId: $userId) {
      ...NotificationFields
    }
  }
  ${NotificationFields}
`;
