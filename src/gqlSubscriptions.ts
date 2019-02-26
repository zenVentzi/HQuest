import gql from "graphql-tag";
import { NotificationFields } from "Fragments";

export const NEW_NOTIFICATION = gql`
  subscription newNotification($userId: ID!) {
    newNotification(userId: $userId) {
      ...NotificationFields
    }
  }
  ${NotificationFields}
`;
