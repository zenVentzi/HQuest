import * as gqlTypes from "../autoGenTypes";
import {
  Notification as DbNotification,
  NotificationType,
  NewComment as DbNewComment,
  AnswerEditionMention as DbAnswerEditionMention
} from "../../dbTypes";

function mapNotification(notif: DbNotification): gqlTypes.Notification {
  const gqlNotif: gqlTypes.Notification = {
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
    case NotificationType.CommentLike: {
      const res: gqlTypes.NewComment | gqlTypes.CommentLike = {
        ...gqlNotif,
        questionId: (notif as DbNewComment).questionId,
        editionId: (notif as DbNewComment).editionId,
        commentId: (notif as DbNewComment).commentId,
        userProfileId: (notif as DbNewComment).userProfileId
      };
      return res;
    }
    case NotificationType.AnswerEditionMention:
    case NotificationType.AnswerEditionLike: {
      const res: gqlTypes.AnswerEditionMention | gqlTypes.AnswerEditionLike = {
        ...gqlNotif,
        questionId: (notif as DbAnswerEditionMention).questionId,
        editionId: (notif as DbAnswerEditionMention).editionId,
        userProfileId: (notif as DbAnswerEditionMention).userProfileId
      };
      return res;
    }
  }
  throw Error(`unknown type ${notif.type}`);
}

function mapNotifications(
  notifs: DbNotification[] | null
): gqlTypes.Notification[] | null {
  if (!notifs || !notifs.length) return null;
  return notifs.map(mapNotification);
  // const arr: Array<DbNewComment | DbNewFollower> = [];
  // return arr;
}

export { mapNotification, mapNotifications };
