import * as FnTypes from "./notificationControllerTypes";
import * as DbTypes from "../dbTypes";

const { ObjectId } = require("mongoose").Types;

const {
  mapGqlNotifications,
  mapGqlNotification
} = require("../resolvers/helper");
const { pubsub, NEW_NOTIFICATION } = require("../PubSub");

const notify: FnTypes.Notify = User => async ({ receiverId, notif }) => {
  await User.findByIdAndUpdate(
    receiverId,
    { $push: { notifications: notif } },
    { upsert: true }
  );

  const payload = {
    receiverId: receiverId.toString(),
    notif: mapGqlNotification(notif)
  };

  pubsub.publish(NEW_NOTIFICATION, payload);
};

const newComment: FnTypes.NewComment = (User, Answer) => async ({
  answerId,
  dbComment,
  loggedUserId
}) => {
  const { questionId, userId: receiverId } = (await Answer.findById(answerId))!;

  const performerId = loggedUserId;
  const performer = await User.findById(performerId).lean();

  if (performer._id.equals(receiverId)) return;
  const performerName = `${performer.firstName} ${performer.surName}`;
  const notif: DbTypes.Notification = {
    _id: ObjectId(),
    type: "NEW_COMMENT",
    questionId,
    commentId: dbComment._id.toString(),
    performerId,
    performerAvatarSrc: performer.avatarSrc,
    text: `${performerName} commented: "${dbComment.value} "`,
    seen: false
  };

  await notify(User)({ receiverId, notif, loggedUserId });
};

const newFollower: FnTypes.NewFollower = User => async ({
  receiverId,
  loggedUserId
}) => {
  const followerId = loggedUserId;

  const follower = await User.findById(followerId).lean();

  const followerName = `${follower.firstName} ${follower.surName}`;
  const notif = {
    _id: ObjectId(),
    type: "NEW_FOLLOWER",
    performerId: followerId,
    performerAvatarSrc: follower.avatarSrc,
    text: `${followerName} is following you`,
    seen: false
  };

  await notify(User)({ receiverId, notif, loggedUserId });
};

const markSeen: FnTypes.MarkSeen = User => async ({ loggedUserId }) => {
  const searchQuery = {
    _id: ObjectId(loggedUserId),
    "notifications.seen": false
  };

  await User.update(searchQuery, { $set: { "notifications.$[].seen": true } });
};

const getNotifications: FnTypes.GetNotifications = User => async ({
  loggedUserId
}) => {
  const { notifications } = (await User.findById(loggedUserId))!;

  if (!notifications) {
    return null;
  }
  //newest first
  return notifications.reverse();
};

const controllerCreator = (User, Answer) => {
  return {
    newFollower,
    newComment: newComment(User, Answer),
    getNotifications: getNotifications(User),
    markSeen
  };
};

export default controllerCreator;
