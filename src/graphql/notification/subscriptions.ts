import gql from "graphql-tag";
import { NotificationFields } from "GqlClient/fragments";
import { DocumentNode } from "graphql";

export const NEW_NOTIFICATION = gql`
  subscription newNotification($userId: ID!) {
    newNotification(userId: $userId) {
      ...NotificationFields
    }
  }
  ${NotificationFields}
`;
