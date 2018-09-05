const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const {
  mapGqlNotifications,
  mapGqlNotification,
} = require('../resolvers/helper');
const { pubsub, NEW_NOTIFICATION } = require('../PubSub');

const newFollower = async (userId, context) => {
  const {
    models: { User },
    user,
  } = context;

  const followerId = user.id;
  const followedId = userId;

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

  await User.findByIdAndUpdate(
    followedId,
    { $push: { notifications: notif } },
    { upsert: true }
  );

  const payload = {
    receiverId: followedId,
    notif: mapGqlNotification(notif),
  };

  pubsub.publish(NEW_NOTIFICATION, payload);
};

const markSeen = async context => {
  const {
    models: { User },
    user,
  } = context;

  const { collections } = context;
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

  const userDoc = await User.findById(context.user.id);
  const notifs = userDoc.toObject().notifications || [];
  const res = mapGqlNotifications(notifs);
  return res;
};

module.exports = {
  newFollower,
  getNotifications,
  markSeen,
};
