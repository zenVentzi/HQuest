import { ApolloContext } from "gqlContext";
import mongoose from "mongoose";
import * as DbTypes from "../dbTypes";
// import { gqlMapper } from "../gqlMapper";
import { NEW_NOTIFICATION, pubsub } from "../PubSub";
import { Models } from "../models";

const { ObjectId } = mongoose.Types;

class NotificationService {
  constructor(private models: Models) {}

  public async onNewComment(
    performerId: string,
    answerId: string,
    dbComment: DbTypes.Comment,
    mentionedUsersIds: string[] | null | undefined
  ): Promise<void> {
    const answer = (await this.models.answer.findById(answerId))!;
    const ownsAnswer = answer.userId === performerId;
    if (!ownsAnswer) {
      const notifForAnswerOwner = await this.createCommentNotification(
        DbTypes.NotificationType.NewComment,
        performerId,
        dbComment,
        answer
      );

      await this.notifyOne(answer.userId, notifForAnswerOwner);
    }
    if (mentionedUsersIds && mentionedUsersIds.length) {
      const notifForMentionedUsers = await this.createCommentNotification(
        DbTypes.NotificationType.CommentMention,
        performerId,
        dbComment,
        answer
      );
      await this.notifyMany(mentionedUsersIds, notifForMentionedUsers);
    }
  }

  public async onCommentEdit(
    performerId: string,
    answerId: string,
    dbComment: DbTypes.Comment,
    mentionedUsersIds: string[] | null | undefined
  ): Promise<void> {
    if (!mentionedUsersIds || mentionedUsersIds.length === 0) return;
    const answer = (await this.models.answer.findById(answerId))!;

    const notMentionedUserIds = await this.filterOutMentioned(
      dbComment,
      mentionedUsersIds
    );

    if (notMentionedUserIds.length > 0) {
      const notif = await this.createCommentNotification(
        DbTypes.NotificationType.CommentMention,
        performerId,
        dbComment,
        answer
      );
      await this.notifyMany(notMentionedUserIds, notif);
    }
  }

  public async onNewAnswerEdition(
    dbAnswer: DbTypes.Answer,
    performerId: string,
    mentionedUsersIds: string[] | null | undefined
  ): Promise<void> {
    if (!mentionedUsersIds || !mentionedUsersIds.length) return;

    const notifForMentionedUsers = await this.createAnswerEditionNotification(
      DbTypes.NotificationType.AnswerEditionMention,
      dbAnswer,
      performerId
    );
    await this.notifyMany(mentionedUsersIds, notifForMentionedUsers);
  }

  public async onNewFollower(
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

    await this.notifyOne(receiverId, notif);
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

  private async notifyOne(
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
  private async notifyMany(
    receiversIds: string[],
    notif: DbTypes.Notification
  ): Promise<void> {
    await this.models.user.updateMany(
      { _id: { $in: receiversIds } },
      { $push: { notifications: notif } },
      { upsert: true }
    );

    const payload = {
      receiversIds,
      notif
      // notif: gqlMapper.getNotification(notif)
    };

    pubsub.publish(NEW_NOTIFICATION, payload);
  }

  private async createAnswerEditionNotification(
    type: DbTypes.NotificationType.AnswerEditionMention,
    answer: DbTypes.Answer,
    performerId: string
  ): Promise<DbTypes.Notification> {
    const performer = await this.models.user.findById(performerId).lean();

    const performerName = `${performer.firstName} ${performer.surName}`;
    const lastEdition = answer.editions[answer.editions.length - 1];
    const notifText = `${performerName} mentioned you in answer: "${
      lastEdition.value
    } "`;
    /* here we have to save the userId from answer */
    const notif: DbTypes.AnswerEditionMention = {
      _id: ObjectId(),
      type,
      userProfileId: answer.userId,
      questionId: answer.questionId,
      editionId: lastEdition._id.toHexString(),
      performerId,
      performerAvatarSrc: performer.avatarSrc,
      text: notifText,
      seen: false
    };
    return notif;
  }

  private async createCommentNotification(
    type:
      | DbTypes.NotificationType.NewComment
      | DbTypes.NotificationType.CommentMention,
    performerId: string,
    dbComment: DbTypes.Comment,
    answer: DbTypes.Answer
  ): Promise<DbTypes.NewComment> {
    const performer = await this.models.user.findById(performerId).lean();

    const lastEdition = answer.editions[answer.editions.length - 1];
    const performerName = `${performer.firstName} ${performer.surName}`;
    const notifText =
      type === DbTypes.NotificationType.NewComment
        ? `${performerName} commented: "${dbComment.value} "`
        : `${performerName} mentioned you in comment: "${dbComment.value} "`;
    /* here we have to save the userId from answer */
    const notif: DbTypes.NewComment = {
      _id: ObjectId(),
      type,
      userProfileId: answer.userId,
      questionId: answer.questionId,
      editionId: lastEdition._id.toHexString(),
      commentId: dbComment._id.toString(),
      performerId,
      performerAvatarSrc: performer.avatarSrc,
      text: notifText,
      seen: false
    };
    return notif;
  }

  private async filterOutMentioned(
    dbComment: DbTypes.Comment,
    mentionedUsersIds: string[]
  ): Promise<string[]> {
    const users = (await this.models.user
      .find({
        _id: { $in: mentionedUsersIds }
      })
      .lean()) as DbTypes.User[];

    const usersWithoutNotif = users.filter(user => {
      if (!user.notifications) return true;
      const commentNotif = user.notifications.find(notif => {
        if (!(notif as DbTypes.NewComment).commentId) return false;
        return dbComment._id.equals((notif as DbTypes.NewComment).commentId);
      });

      return !commentNotif;
    });

    return usersWithoutNotif.map(user => user._id.toHexString());
  }
}

export { NotificationService };
