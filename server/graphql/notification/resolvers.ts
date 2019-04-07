import { withFilter } from "apollo-server";
import { pubsub, NEW_NOTIFICATION } from "../../PubSub";

import {
  QueryResolvers,
  MutationResolvers,
  SubscriptionResolvers,
  NotificationResolvers,
  Notification
} from "../autoGenTypes";
import { mapNotifications } from "./gqlMapper";
import { authMiddleware } from "../middlewares";

const Notification: NotificationResolvers = {
  __resolveType(obj, context, info) {
    authMiddleware(context.user);

    switch (obj.type) {
      case "NEW_COMMENT":
      case "COMMENT_MENTION":
        return "NewComment";
      case "NEW_FOLLOWER":
        return "NewFollower";
    }

    throw Error(`unknown type, ${obj.type}`);
  }
};

type Query = Required<Pick<QueryResolvers, "notifications">>;
type Mutation = Required<Pick<MutationResolvers, "notifsMarkSeen">>;
type Subscription = Required<Pick<SubscriptionResolvers, "newNotification">>;

const Query: Query = {
  async notifications(_, __, { services, user }) {
    authMiddleware(user);

    const dbNotifications = await services.notification.getNotifications(
      user!.id
    );

    const gqlNotifications = mapNotifications(dbNotifications);
    return gqlNotifications;
  }
};

const Mutation: Mutation = {
  async notifsMarkSeen(_, __, { services, user }) {
    authMiddleware(user);

    await services.notification.markSeen(user!.id);
    return true; // fix: remove that
  }
};

// fix the type
const Subscription: any = {
  newNotification: {
    resolve: payload => payload.notif, // this needs gqlMapper
    subscribe: withFilter(
      (_, __, context) => {
        authMiddleware(context.user);

        return pubsub.asyncIterator(NEW_NOTIFICATION);
      },
      (payload, variables) => {
        const subscriberId = variables.userId;
        if (payload.receiverId) {
          return payload.receiverId === subscriberId;
        } else if (payload.receiversIds) {
          return payload.receiversIds.includes(subscriberId);
        }

        throw Error(
          `incorrect format. Payload must have either receiverId or receiverIds`
        );
      }
    )
  }
};

export { Notification, Query, Mutation, Subscription };
