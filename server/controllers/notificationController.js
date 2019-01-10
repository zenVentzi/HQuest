const { ObjectId } = require('mongoose').Types;

const {
  mapGqlNotifications,
  mapGqlNotification,
} = require('../resolvers/helper');
const { pubsub, NEW_NOTIFICATION } = require('../PubSub');

const notify = async (receiverId, notif, userModel) => {
  await userModel.findByIdAndUpdate(
    receiverId,
    { $push: { notifications: notif } },
    { upsert: true }
  );

  const payload = {
    receiverId: receiverId.toString(),
    notif: mapGqlNotification(notif),
  };

  pubsub.publish(NEW_NOTIFICATION, payload);
};

const newComment = async (answerId, dbComment, context) => {
  const {
    models: { User, Answer },
    user,
  } = context;

  const { questionId, userId: receiverId } = await Answer.findById(
    answerId
  ).lean();

  const performerId = user.id;
  const performer = await User.findById(performerId).lean();

  if (performer._id.equals(receiverId)) return;

  const performerName = `${performer.firstName} ${performer.surName}`;
  const notif = {
    _id: ObjectId(),
    type: 'NEW_COMMENT',
    questionId,
    commentId: dbComment._id.toString(),
    performerId,
    performerAvatarSrc: performer.avatarSrc,
    text: `${performerName} commented: "${dbComment.comment} "`,
    seen: false,
  };

  await notify(receiverId, notif, User);
};

const newFollower = async (receiverId, context) => {
  const {
    models: { User },
    user,
  } = context;

  const followerId = user.id;

  const follower = await User.findById(followerId).lean();

  const followerName = `${follower.firstName} ${follower.surName}`;
  const notif = {
    _id: ObjectId(),
    type: 'NEW_FOLLOWER',
    performerId: followerId,
    performerAvatarSrc: follower.avatarSrc,
    text: `${followerName} is following you`,
    seen: false,
  };

  await notify(receiverId, notif, User);
};

const markSeen = async context => {
  const {
    models: { User },
    user,
  } = context;

  const searchQuery = {
    _id: ObjectId(user.id),
    'notifications.seen': false,
  };
  const updateObj = { $set: { 'notifications.$[].seen': true } };
  await User.update(searchQuery, updateObj);
};

const getNotifications = async context => {
  const {
    models: { User },
  } = context;

  const { notifications } = await User.findById(context.user.id).lean();

  if (!notifications) {
    return null;
  }

  const res = mapGqlNotifications(notifications);
  return res.reverse();
};

module.exports = () => {
  return {
    newFollower,
    newComment,
    getNotifications,
    markSeen,
  };
};
