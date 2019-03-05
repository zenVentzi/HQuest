import React from "react";
import { Query, Mutation, MutationFn } from "react-apollo";
import { GET_NOTIFICATIONS } from "GqlClient/notification/queries";
import { NOTIFS_MARK_SEEN } from "GqlClient/notification/mutations";
import { NEW_NOTIFICATION } from "GqlClient/notification/subscriptions";
import { getLoggedUserId } from "Utils";
import { ApolloError } from "apollo-client";
import {
  NotificationsQuery,
  NotificationsVariables,
  NotificationsNotifications,
  NotifsMarkSeenMutation,
  NotifsMarkSeenVariables
} from "GqlClient/autoGenTypes";

const getSubcriptionOptions = () => {
  const userId = getLoggedUserId();
  return {
    document: NEW_NOTIFICATION,
    variables: { userId },
    updateQuery: (prev: any, { subscriptionData }: any) => {
      if (!subscriptionData.data) return prev; // start here, check when data is received
      const { newNotification } = subscriptionData.data;

      const updatedQuery = {
        ...prev,
        notifications: [newNotification, ...prev.notifications]
      };

      return updatedQuery;
    }
  };
};

const updateSeen = (cache: any) => {
  const { notifications } = cache.readQuery({ query: GET_NOTIFICATIONS });
  if (!notifications || !notifications.length) {
    return;
  }
  const updated = notifications.map((n: any) => ({ ...n, seen: true }));

  cache.writeQuery({
    query: GET_NOTIFICATIONS,
    data: { notifications: updated }
  });
};

let subscribed = false;

interface NotificationsGQLProps {
  children: (
    loading: boolean,
    error: ApolloError | undefined,
    notifications: NotificationsNotifications[] | null,
    markSeen: MutationFn<NotifsMarkSeenMutation, NotifsMarkSeenVariables>
  ) => any;
}

const NotificationsGQL = ({ children }: NotificationsGQLProps) => (
  <Query<NotificationsQuery, NotificationsVariables> query={GET_NOTIFICATIONS}>
    {({ loading, error, data, subscribeToMore }) => {
      // return null;
      if (!subscribed) {
        subscribeToMore(getSubcriptionOptions());
        subscribed = true;
      }

      let notifications: NotificationsNotifications[] | null;

      if (data) {
        notifications = data.notifications;
      }

      return (
        <Mutation<NotifsMarkSeenMutation, NotifsMarkSeenVariables>
          mutation={NOTIFS_MARK_SEEN}
          update={updateSeen}
        >
          {markSeen => children(loading, error, notifications, markSeen)}
        </Mutation>
      );
    }}
  </Query>
);

export default NotificationsGQL;
