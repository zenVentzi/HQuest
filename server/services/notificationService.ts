import { ApolloContext } from "gqlContext";
import mongoose from "mongoose";
import * as DbTypes from "../dbTypes";
// import { gqlMapper } from "../gqlMapper";
import { NEW_NOTIFICATION, pubsub } from "../PubSub";
import { Models } from "../models";

const { ObjectId } = mongoose.Types;

class NotificationService {
  constructor(private models: Models) {}

  public async newComment(
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

    await this.notify(
      {
        receiverId: receiverId.toHexString(),
        notif
      },
      context
    );
  }

  public async newFollower(
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

    await this.notify({ receiverId, notif }, context);
  }

  public async markSeen({ models, user }: ApolloContext): Promise<void> {
    const searchQuery = {
      _id: ObjectId(user!.id)
      // "notifications.seen": false
    };

    const userDoc = await models.user.findOne(searchQuery);

    userDoc!.notifications!.forEach(notif => {
      notif.seen = true;
    });

    await userDoc!.save();

    // await models.user.update(searchQuery, {
    //   $set: { "notifications.$[].seen": true }
    // });
  }

  public async getNotifications({
    models,
    user
  }: ApolloContext): Promise<DbTypes.Notification[] | null> {
    const dbUser = (await models.user.findById(user!.id))!.toObject();
    const { notifications } = dbUser;

    return notifications && notifications.length
      ? notifications.reverse()
      : null;
  }

  private async notify(
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
      notif
      // notif: gqlMapper.getNotification(notif)
    };

    pubsub.publish(NEW_NOTIFICATION, payload);
  }
}

export { NotificationService };
