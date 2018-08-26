import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { loggedUserId } from '../../utils';

const NOTIFICATIONS = gql`
  query notifications {
    notifications {
      id
      performerId
      performerAvatarSrc
      text
      seen
      createdOn
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

      console.log(prev);
      console.log(updatedQuery);

      return updatedQuery;
    },
  });
};

let subscribed = false;

const NotificationsGQL = ({ children }) => (
  <Query query={NOTIFICATIONS}>
    {({ loading, error, data: { notifications }, subscribeToMore }) => {
      if (!subscribed) {
        console.log(`subscribing`);
        run(subscribeToMore);
        subscribed = true;
      }

      // console.log(notifications);

      return (
        <Mutation mutation={NOTIFS_MARK_SEEN}>
          {markSeen => children(loading, error, notifications, markSeen)}
        </Mutation>
      );
    }}
  </Query>
);

export default NotificationsGQL;
