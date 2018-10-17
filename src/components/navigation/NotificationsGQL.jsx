import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { GET_NOTIFICATIONS } from 'Queries';
import { NOTIFS_MARK_SEEN } from 'Mutations';
import { NEW_NOTIFICATION } from 'Subscriptions';
import { getLoggedUserId } from 'Utils';

const run = subscribeToMore => {
  subscribeToMore({
    document: NEW_NOTIFICATION,
    variables: { userId: getLoggedUserId() },
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
