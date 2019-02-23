import { withFilter } from "apollo-server";
import { pubsub, NEW_NOTIFICATION } from "../../PubSub";
import { Query, Mutation, Subscription } from "./types";
import { mapNotifications } from "./gqlMapper";

const Notification = {
  __resolveType(obj, context, info) {
    if (obj.type === "NEW_COMMENT") {
      return "NewComment";
    }

    return "NewFollower";
  }
};

const Query: Query = {
  async notifications(_, __, { services, user }) {
    const dbNotifications = await services.notification.getNotifications(
      user!.id
    );

    const gqlNotifications = mapNotifications(dbNotifications);
    return gqlNotifications;
  }
};
const Mutation: Mutation = {
  async notifsMarkSeen(_, __, { services, user }) {
    await services.notification.markSeen(user!.id);
    return true; // fix: remove that
  }
};

// fix the type
const Subscription: any = {
  newNotification: {
    resolve: payload => payload.notif, // this needs gqlMapper
    subscribe: withFilter(
      () => {
        return pubsub.asyncIterator(NEW_NOTIFICATION);
      },
      (payload, variables) => {
        const subscriberId = variables.userId;
        return payload.receiverId === subscriberId;
      }
    )
  }
};

export { Notification, Query, Mutation, Subscription };
