import { Query, Mutation } from "./types";
import { mapNotifications } from "./gqlMapper";
import { notificationService } from "../../services";

const Query: Query = {
  async notifications(_, __, context) {
    const dbNotifications = await notificationService.getNotifications(context);

    const gqlNotifications = mapNotifications(dbNotifications);
    return gqlNotifications;
  }
};
const Mutation: Mutation = {
  async notifsMarkSeen(_, __, context) {
    await notificationService.markSeen(context);
    return true; // fix: remove that
  }
};

export { Query, Mutation };
