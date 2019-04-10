import gql from "graphql-tag";
import { NotificationFields } from "GqlClient/fragments";

export const GET_NOTIFICATIONS = gql`
  query notifications {
    notifications {
      ...NotificationFields
    }
  }
  ${NotificationFields}
`;
