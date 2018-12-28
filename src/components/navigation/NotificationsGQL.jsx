import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { GET_NOTIFICATIONS } from 'Queries';
import { NOTIFS_MARK_SEEN } from 'Mutations';
import { NEW_NOTIFICATION } from 'Subscriptions';
import { getLoggedUserId } from 'Utils';

const getSubcriptionOptions = () => {
  const userId = getLoggedUserId();
  return {
    document: NEW_NOTIFICATION,
    variables: { userId },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev; // start here, check when data is received
      const { newNotification } = subscriptionData.data;

      const updatedQuery = {
        ...prev,
        notifications: [newNotification, ...prev.notifications],
      };

      return updatedQuery;
    },
  };
};

const updateSeen = cache => {
  const { notifications } = cache.readQuery({ query: GET_NOTIFICATIONS });
  if (!notifications || !notifications.length) {
    return;
  }
  const updated = notifications.map(n => ({ ...n, seen: true }));

  cache.writeQuery({
    query: GET_NOTIFICATIONS,
    data: { notifications: updated },
  });
};

let subscribed = false;

const NotificationsGQL = ({ children }) => (
  <Query query={GET_NOTIFICATIONS}>
    {({ loading, error, data, subscribeToMore }) => {
      // return null;
      if (!subscribed) {
        subscribeToMore(getSubcriptionOptions());
        subscribed = true;
      }

      let notifications = null;

      if (data) {
        // eslint-disable-next-line prefer-destructuring
        notifications = data.notifications;
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
