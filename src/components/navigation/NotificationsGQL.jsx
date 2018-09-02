import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { loggedUserId } from '../../utils';

// const Fragments = {
//   NotifFields: gql`
//     fragment NotifFields on Notification {
//       id
//       type
//       performerId
//       performerAvatarSrc
//       text
//       seen
//       createdOn
//       ... on NewComment {
//         commentId
//       }
//     }
//   `,
// };

const GET_NOTIFICATIONS = gql`
  query notifications {
    notifications {
      id
      type
      performerId
      performerAvatarSrc
      text
      seen
      createdOn
      ... on NewComment {
        commentId
      }
    }
  }
`;

const NOTIFS_MARK_SEEN = gql`
  mutation notifsMarkSeen {
    notifsMarkSeen
  }
`;

const NEW_NOTIFICATION = gql`
  subscription newNotification($userId: ID!) {
    newNotification(userId: $userId) {
      id
      type
      performerId
      performerAvatarSrc
      text
      seen
      createdOn
    }
  }
`;

const run = subscribeToMore => {
  subscribeToMore({
    document: NEW_NOTIFICATION,
    variables: { userId: loggedUserId() },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev; // start here, check when data is received
      const { newNotification } = subscriptionData.data;

      const updatedQuery = {
        ...prev,
        notifications: [...prev.notifications, newNotification],
      };

      return updatedQuery;
    },
  });
};

const updateSeen = cache => {
  const { notifications } = cache.readQuery({ query: GET_NOTIFICATIONS });
  const updated = notifications.map(n => ({ ...n, seen: true }));

  cache.writeQuery({
    query: GET_NOTIFICATIONS,
    data: { notifications: updated },
  });
};

let subscribed = false;

const NotificationsGQL = ({ children }) => (
  <Query query={GET_NOTIFICATIONS}>
    {({ loading, error, data: { notifications }, subscribeToMore }) => {
      if (!subscribed) {
        run(subscribeToMore);
        subscribed = true;
      }

      return (
        <Mutation mutation={NOTIFS_MARK_SEEN} update={updateSeen}>
          {markSeen => children(loading, error, notifications, markSeen)}
        </Mutation>
      );
    }}
  </Query>
);

export default NotificationsGQL;
