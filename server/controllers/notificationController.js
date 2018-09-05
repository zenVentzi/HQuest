const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const { mapGqlNotifications } = require('../resolvers/helper');

const newFollower = async (userId, context) => {
  const {
    models: { User },
    user,
  } = context;

  const performerId = user.id;
  const receiverId = userId;

  const performer = await User.findOneAndUpdate(
    { _id: ObjectId(performerId) },
    { $push: { following: ObjectId(receiverId) } },
    { upsert: true }
  );

  const performerName = `${performer.firstName} ${performer.surName}`;
  const notif = {
    _id: ObjectId(),
    type: 'NEW_FOLLOWER',
    performerId,
    performerAvatarSrc: performer.avatarSrc,
    text: `${performerName} is following you`,
    seen: false,
  };

  await User.updateOne(
    { _id: ObjectId(receiverId) },
    { $push: { notifications: notif } },
    { upsert: true }
  );

  const payload = { receiverId, notif: mapGqlNotification(notif) };

  pubsub.publish('newNotification', payload);
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
