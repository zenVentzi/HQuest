import {
  Notification,
  NewComment,
  AnswerEditionMention
} from "../autoGenTypes";
import {
  Notification as DbNotification,
  NotificationType,
  NewComment as DbNewComment,
  AnswerEditionMention as DbAnswerEditionMention
} from "../../dbTypes";

function mapNotification(notif: DbNotification): Notification {
  const gqlNotif: Notification = {
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
    case NotificationType.CommentMention: {
      const res: NewComment = {
        ...gqlNotif,
        questionId: (notif as DbNewComment).questionId,
        editionId: (notif as DbNewComment).editionId,
        commentId: (notif as DbNewComment).commentId,
        userProfileId: (notif as DbNewComment).userProfileId
      };
      return res;
    }
    case NotificationType.AnswerEditionMention: {
      const res: AnswerEditionMention = {
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
): Notification[] | null {
  if (!notifs || !notifs.length) return null;
  return notifs.map(mapNotification);
  // const arr: Array<DbNewComment | DbNewFollower> = [];
  // return arr;
}

export { mapNotification, mapNotifications };
