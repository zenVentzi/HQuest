import { Notification, NewComment } from "../autoGenTypes";
import {
  Notification as DbNotification,
  NotificationType,
  NewComment as DbNewComment
} from "../../dbTypes";

function mapNotification(notif: DbNotification): Notification {
  const res: Notification = {
    id: notif._id.toString(),
    type: notif.type,
    performerId: notif.performerId,
    performerAvatarSrc: notif.performerAvatarSrc,
    text: notif.text,
    seen: notif.seen,
    createdOn: notif._id.getTimestamp()
  };

  switch (notif.type) {
    case NotificationType.NewComment:
    case NotificationType.CommentMention:
      (res as NewComment).questionId = (notif as DbNewComment).questionId;
      (res as NewComment).commentId = (notif as DbNewComment).commentId;
      (res as NewComment).userProfileId = (notif as DbNewComment).userProfileId;
      break;

    default:
      break;
  }

  return res;
}

function mapNotifications(
  notifs: DbNotification[] | null
): Notification[] | null {
  if (!notifs || !notifs.length) return null;
  return notifs.map(mapNotification);
  // const arr: Array<DbNewComment | DbNewFollower> = [];
  // return arr;
}

export { mapNotification, mapNotifications };
