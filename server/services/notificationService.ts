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
    performerId: string,
    answerId: string,
    dbComment: DbTypes.Comment
  ): Promise<void> {
    const {
      questionId,
      userId: receiverId
    } = (await this.models.answer.findById(answerId))!;

    const performer = await this.models.user.findById(performerId).lean();

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

    await this.notify(receiverId.toHexString(), notif);
  }

  public async newFollower(
    receiverId: string,
    followerId: string
  ): Promise<void> {
    const follower = await this.models.user.findById(followerId).lean();

    const followerName = `${follower.firstName} ${follower.surName}`;
    const notif: DbTypes.Notification = {
      _id: ObjectId(),
      type: DbTypes.NotificationType.NewFollower,
      performerId: followerId,
      performerAvatarSrc: follower.avatarSrc,
      text: `${followerName} is following you`,
      seen: false
    };

    await this.notify(receiverId, notif);
  }

  public async markSeen(userId: string): Promise<void> {
    const searchQuery = {
      _id: ObjectId(userId)
    };

    const userDoc = await this.models.user.findOne(searchQuery);

    userDoc!.notifications!.forEach(notif => {
      notif.seen = true;
    });

    await userDoc!.save();
  }

  public async getNotifications(
    userId
  ): Promise<DbTypes.Notification[] | null> {
    const dbUser = (await this.models.user.findById(userId))!.toObject();
    const { notifications } = dbUser;

    return notifications && notifications.length
      ? notifications.reverse()
      : null;
  }

  private async notify(
    receiverId: string,
    notif: DbTypes.Notification
  ): Promise<void> {
    await this.models.user.findByIdAndUpdate(
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
