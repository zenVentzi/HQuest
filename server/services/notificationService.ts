import mongoose from "mongoose";
import * as DbTypes from "../dbTypes";
import { gqlMapper } from "../gqlMapper";
import { NEW_NOTIFICATION, pubsub } from "../PubSub";
import * as FnTypes from "./notificationServiceTypes";
import { ApolloContext } from "gqlContext";

const { ObjectId } = mongoose.Types;

async function notify(
  { receiverId, notif },
  { models }: ApolloContext
): Promise<void> {
  await models.user.findByIdAndUpdate(
    receiverId,
    { $push: { notifications: notif } },
    { upsert: true }
  );

  const payload = {
    receiverId: receiverId.toString(),
    notif: gqlMapper.getNotification(notif)
  };

  pubsub.publish(NEW_NOTIFICATION, payload);
}

async function newComment(
  { answerId, dbComment }: { answerId: string; dbComment: DbTypes.Comment },
  context: ApolloContext
): Promise<void> {
  const { models, user } = context;
  const { questionId, userId: receiverId } = (await models.answer.findById(
    answerId
  ))!;

  const performerId = user!.id;
  const performer = await models.user.findById(performerId).lean();

  if (performer._id.equals(receiverId)) return;
  const performerName = `${performer.firstName} ${performer.surName}`;
  const notif: DbTypes.Notification = {
    _id: ObjectId(),
    type: DbTypes.NotificationType.NewComment,
    questionId: questionId.toHexString(),
    commentId: dbComment._id.toString(),
    performerId,
    performerAvatarSrc: performer.avatarSrc,
    text: `${performerName} commented: "${dbComment.value} "`,
    seen: false
  };

  await notify(
    {
      receiverId: receiverId.toHexString(),
      notif
    },
    context
  );
}

async function newFollower(
  { receiverId }: { receiverId: string },
  context: ApolloContext
): Promise<void> {
  const { models, user } = context;
  const followerId = user!.id;

  const follower = await models.user.findById(followerId).lean();

  const followerName = `${follower.firstName} ${follower.surName}`;
  const notif: DbTypes.Notification = {
    _id: ObjectId(),
    type: DbTypes.NotificationType.NewFollower,
    performerId: followerId,
    performerAvatarSrc: follower.avatarSrc,
    text: `${followerName} is following you`,
    seen: false
  };

  await notify({ receiverId, notif }, context);
}

async function markSeen({ models, user }: ApolloContext): Promise<void> {
  const searchQuery = {
    _id: ObjectId(user!.id),
    "notifications.seen": false
  };

  await models.user.update(searchQuery, {
    $set: { "notifications.$[].seen": true }
  });
}

async function getNotifications({
  models,
  user
}: ApolloContext): Promise<DbTypes.Notification[] | null> {
  const { notifications } = (await models.user.findById(user!.id))!;

  if (!notifications) {
    return null;
  }
  //newest first
  return notifications.reverse();
}

export const notificationService = {
  newFollower,
  newComment,
  getNotifications,
  markSeen
};
