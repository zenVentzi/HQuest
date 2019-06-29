import { ApolloContext } from "gqlContext";
import mongoose from "mongoose";
import * as DbTypes from "../dbTypes";
// import { gqlMapper } from "../gqlMapper";
import { NEW_NOTIFICATION, pubsub } from "../PubSub";
import { Models } from "../models";
import { mapNotification } from "../graphql/notification/gqlMapper";

const { ObjectId } = mongoose.Types;

class NotificationService {
  constructor(private models: Models) {}

  public async onNewComment(
    performerId: string,
    answerId: string,
    answerEditionId: string,
    dbComment: DbTypes.Comment,
    mentionedUsersIds: string[] | null | undefined
  ): Promise<void> {
    const answer = await this.models.answer.findById(answerId);
    if (!answer) {
      throw Error(`could not find answer with id ${answerId}`);
    }

    const edition = answer.editions.find(e => e._id.equals(answerEditionId));
    if (!edition) {
      throw Error(`could not find edition with id: ${answerEditionId}`);
    }
    const ownsAnswer = answer.userId === performerId;
    if (!ownsAnswer) {
      const notifForAnswerOwner = await this.createCommentNotification(
        DbTypes.NotificationType.NewComment,
        performerId,
        dbComment,
        answer,
        edition
      );

      await this.notifyOne(answer.userId, notifForAnswerOwner);
    }
    if (mentionedUsersIds && mentionedUsersIds.length) {
      const notifForMentionedUsers = await this.createCommentNotification(
        DbTypes.NotificationType.CommentMention,
        performerId,
        dbComment,
        answer,
        edition
      );
      await this.notifyMany(mentionedUsersIds, notifForMentionedUsers);
    }
  }

  public async onCommentEdit(
    performerId: string,
    answerId: string,
    answerEditionId: string,
    dbComment: DbTypes.Comment,
    mentionedUsersIds: string[] | null | undefined
  ): Promise<void> {
    if (!mentionedUsersIds || mentionedUsersIds.length === 0) return;
    const answer = await this.models.answer.findById(answerId);
    if (!answer) {
      throw Error(`could not find answer with id ${answerId}`);
    }

    const edition = answer.editions.find(e => e._id.equals(answerEditionId));
    if (!edition) {
      throw Error(`could not find edition with id: ${answerEditionId}`);
    }

    const newlyMentionedUserIds = await this.filterOutMentioned(
      dbComment,
      mentionedUsersIds
    );

    if (newlyMentionedUserIds.length > 0) {
      const notif = await this.createCommentNotification(
        DbTypes.NotificationType.CommentMention,
        performerId,
        dbComment,
        answer,
        edition
      );
      await this.notifyMany(newlyMentionedUserIds, notif);
    }
  }

  public async onCommentLike(
    dbComment: DbTypes.Comment,
    answerId: string,
    answerEditionId: string,
    performerId: string,
    addedExperience: number
  ): Promise<void> {
    const answer = await this.models.answer.findById(answerId);
    if (!answer) {
      throw Error(`could not find answer with id ${answerId}`);
    }

    const edition = answer.editions.find(e => e._id.equals(answerEditionId));
    if (!edition) {
      throw Error(`could not find edition with id: ${answerEditionId}`);
    }

    let alreadyNotified = false;
    let prevNotif: DbTypes.CommentLike;
    const commentOwner = await this.models.user.findById(answer.userId);
    if (!commentOwner) {
      throw Error(`could not find commentOwner with id: ${answer.userId}`);
    }
    const userNotifs = commentOwner.notifications;
    if (userNotifs && userNotifs.length) {
      userNotifs.forEach(notif => {
        if (
          notif.type === DbTypes.NotificationType.CommentLike &&
          (notif as DbTypes.CommentLike).commentId ===
            dbComment._id.toHexString()
        ) {
          alreadyNotified = true;
          prevNotif = notif as DbTypes.CommentLike;
        }
      });
    }

    if (alreadyNotified) {
      prevNotif!.text = prevNotif!.text.replace(
        /\(\+\d+exp\)/,
        `(+${addedExperience}exp)`
      );
      await commentOwner.save();
      return;
    }

    const notifForCommentOwner = await this.createCommentNotification(
      DbTypes.NotificationType.CommentLike,
      performerId,
      dbComment,
      answer,
      edition,
      addedExperience
    );
    await this.notifyOne(answer.userId, notifForCommentOwner);
  }

  public async onNewAnswerEdition(
    dbAnswer: DbTypes.Answer,
    performerId: string,
    mentionedUsersIds: string[] | null | undefined
  ): Promise<void> {
    if (!mentionedUsersIds || !mentionedUsersIds.length) return;

    const notifForMentionedUsers = await this.createAnswerEditionMentionNotification(
      DbTypes.NotificationType.AnswerEditionMention,
      dbAnswer,
      performerId
    );
    await this.notifyMany(mentionedUsersIds, notifForMentionedUsers);
  }

  public async onEditionLike(
    answerId: string,
    answerEditionId: string,
    performerId: string,
    addedExperience: number
  ): Promise<void> {
    const answer = await this.models.answer.findById(answerId);
    if (!answer) {
      throw Error(`could not find answer with id ${answerId}`);
    }

    const edition = answer.editions.find(e => e._id.equals(answerEditionId));
    if (!edition) {
      throw Error(`could not find edition with id: ${answerEditionId}`);
    }

    let alreadyNotified = false;
    let prevNotif: DbTypes.AnswerEditionLike | undefined;
    const editionOwner = await this.models.user.findById(answer.userId);
    if (!editionOwner) {
      throw Error(`user cannot be null, id: ${answer.userId}`);
    }
    const userNotifs = editionOwner.notifications;
    if (userNotifs && userNotifs.length) {
      userNotifs.forEach(notif => {
        if (
          notif.type === DbTypes.NotificationType.AnswerEditionLike &&
          (notif as DbTypes.AnswerEditionLike).editionId === answerEditionId
        ) {
          alreadyNotified = true;
          prevNotif = notif as DbTypes.AnswerEditionLike;
        }
      });
    }

    if (alreadyNotified) {
      prevNotif!.text = prevNotif!.text.replace(
        /\(\+\d+exp\)/,
        `(+${addedExperience}exp)`
      );
      await editionOwner.save();
      return;
    }

    const notifForEditionOwner = await this.createAnswerEditionLikeNotification(
      DbTypes.NotificationType.AnswerEditionLike,
      answer,
      edition,
      performerId,
      addedExperience
    );
    await this.notifyOne(answer.userId, notifForEditionOwner);
  }

  public async onDeleteAccount(userId: string): Promise<void> {
    const allUsers = await this.models.user.find();

    for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
      const user = allUsers[userIndex];

      if (user.notifications) {
        user.notifications = user.notifications.filter(
          n => n.performerId !== userId
        );
      }

      if (user.isModified()) {
        /* note that the above might always return true, if
        user.notifications is reasigned with no changes */
        await user.save();
      }
    }
  }

  public async onNewFollower(
    receiverId: string,
    followerId: string
  ): Promise<void> {
    const follower = await this.models.user.findById(followerId);

    if (!follower) {
      throw Error(`Could not find follower with id ${followerId}`);
    }

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
      newNotification: mapNotification(notif)
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
      newNotification: mapNotification(notif)
      // notif: gqlMapper.getNotification(notif)
    };

    pubsub.publish(NEW_NOTIFICATION, payload);
  }

  private async createAnswerEditionMentionNotification(
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

  private async createAnswerEditionLikeNotification(
    type: DbTypes.NotificationType.AnswerEditionLike,
    answer: DbTypes.Answer,
    edition: DbTypes.Edition,
    performerId: string,
    addedExperience?: number
  ): Promise<DbTypes.Notification> {
    const performer = await this.models.user.findById(performerId).lean();

    const performerName = `${performer.firstName} ${performer.surName}`;
    const notifText = `(+${addedExperience}exp) ${performerName} liked your edition: "${
      edition.value
    } "`;

    const notif: DbTypes.AnswerEditionLike = {
      _id: ObjectId(),
      type,
      userProfileId: answer.userId,
      questionId: answer.questionId,
      editionId: edition._id.toHexString(),
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
      | DbTypes.NotificationType.CommentMention
      | DbTypes.NotificationType.CommentLike,
    performerId: string,
    dbComment: DbTypes.Comment,
    answer: DbTypes.Answer,
    edition: DbTypes.Edition,
    addedExperience?: number
  ): Promise<DbTypes.NewComment | DbTypes.CommentLike> {
    const performer = await this.models.user.findById(performerId).lean();

    // const lastEdition = answer.editions[answer.editions.length - 1];
    const performerName = `${performer.firstName} ${performer.surName}`;
    if (type !== DbTypes.NotificationType.CommentLike) {
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
        editionId: edition._id.toHexString(),
        commentId: dbComment._id.toString(),
        performerId,
        performerAvatarSrc: performer.avatarSrc,
        text: notifText,
        seen: false
      };
      return notif;
    }
    const notifText = `(+${addedExperience}exp) ${performerName} liked your comment: "${
      dbComment.value
    } "`;

    const notif: DbTypes.CommentLike = {
      _id: ObjectId(),
      type,
      userProfileId: answer.userId,
      questionId: answer.questionId,
      editionId: edition._id.toHexString(),
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
