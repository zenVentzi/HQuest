import React, { useRef } from "react";
import { Query, Mutation, MutationFn, MutationUpdaterFn } from "react-apollo";
import { GET_NOTIFICATIONS } from "GqlClient/notification/queries";
import { NOTIFS_MARK_SEEN } from "GqlClient/notification/mutations";
import { NEW_NOTIFICATION } from "GqlClient/notification/subscriptions";
import { getLoggedUserId } from "Utils";
import { ApolloError, SubscribeToMoreOptions } from "apollo-client";
import {
  NotificationsQuery,
  NotificationsVariables,
  NotificationsNotifications,
  NotifsMarkSeenMutation,
  NotifsMarkSeenVariables,
  NotificationFieldsFragment
} from "GqlClient/autoGenTypes";

const getSubcriptionOptions = (): SubscribeToMoreOptions<
  NotificationsQuery,
  NotificationsVariables
> => {
  const userId = getLoggedUserId();
  return {
    document: NEW_NOTIFICATION,
    variables: { userId },
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data || !subscriptionData.data.notifications) {
        return prev;
      }
      const { notifications: oldNotifications } = prev;
      const { notifications: newNotifications } = subscriptionData.data;
      const updatedNotifications: NotificationFieldsFragment[] | null = [];
      updatedNotifications.concat(newNotifications);
      if (oldNotifications) {
        updatedNotifications.concat(oldNotifications);
      }

      const updatedQuery: NotificationsQuery = {
        ...prev,
        notifications: updatedNotifications
      };

      return updatedQuery;
    }
  };
};

const updateSeen: MutationUpdaterFn<NotifsMarkSeenMutation> = cache => {
  const cachedQuery = cache.readQuery<
    NotificationsQuery,
    NotificationsVariables
  >({ query: GET_NOTIFICATIONS });
  const { notifications } = cachedQuery!;
  if (!notifications || !notifications.length) {
    return;
  }
  const updated = notifications.map(n => ({ ...n, seen: true }));

  cache.writeQuery({
    query: GET_NOTIFICATIONS,
    data: { notifications: updated }
  });
};

interface NotificationsGQLProps {
  children: (
    loading: boolean,
    error: ApolloError | undefined,
    notifications: NotificationsNotifications[] | null,
    markSeen: MutationFn<NotifsMarkSeenMutation, NotifsMarkSeenVariables>
  ) => JSX.Element;
}

const NotificationsGQL = ({ children }: NotificationsGQLProps) => {
  const subscribed = useRef(false);

  return (
    <Query<NotificationsQuery, NotificationsVariables>
      query={GET_NOTIFICATIONS}
    >
      {({ loading, error, data, subscribeToMore }) => {
        // return null;
        if (!subscribed.current) {
          subscribeToMore(getSubcriptionOptions());
          subscribed.current = true;
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
};

export default NotificationsGQL;
