const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const {
  mapGqlNotification,
  mapGqlComment,
  mapGqlQuestions,
  mapGqlUser,
  mapGqlUsers,
} = require('../resolvers/helper');

const signUp = async ({ firstName, surName, email, password }, context) => {
  const {
    models: { User },
  } = context;

  const obj = {
    firstName,
    surName,
    email,
    password: await bcrypt.hash(password, 10),
  };

  const userDoc = await User.create(obj);
  return mapGqlUser(context, userDoc.toObject());
};

const login = async ({ email, password }, context) => {
  const {
    models: { User },
  } = context;

  const doc = await User.findOne({
    email,
  });

  const user = doc.toObject();

  if (!user) {
    throw new Error('No user with that email');
  }

  const passwordHash = user.password;
  const valid = await bcrypt.compare(password, passwordHash);

  if (!valid) {
    throw new Error('Incorrect password');
  }

  return mapGqlUser(context, user);
};

const followBase = async ({ userId, follow: shouldFollow }, context) => {
  const {
    models: { User },
    user,
  } = context;

  const performerId = user.id;
  const receiverId = userId;

  if (shouldFollow) {
    const performer = await User.findOneAndUpdate(
      { _id: ObjectId(performerId) },
      { $push: { following: ObjectId(receiverId) } },
      { upsert: true }
    );
  } else {
    await User.updateOne(
      { _id: ObjectId(performerId) },
      { $pull: { following: ObjectId(receiverId) } }
    );
    await User.updateOne(
      { _id: ObjectId(receiverId) },
      { $pull: { followers: ObjectId(performerId) } }
    );
  }
};

const follow = async (userId, context) => {
  await followBase({ userId, follow: true }, context);
};

const unfollow = async (userId, context) => {
  await followBase({ userId, follow: false }, context);
};

const getUser = async (userId, context) => {
  const {
    models: { User },
  } = context;

  const userDoc = await User.findById(userId);
  return mapGqlUser(context, userDoc.toObject());
};

const getMatchingUsers = async (match, context) => {
  const {
    models: { User },
  } = context;

  const matchWords = match.split(' ');

  let matchedUsers;
  const numOfWords = matchWords.length;

  if (numOfWords > 2) {
    return [];
  } else if (numOfWords === 2) {
    const firstNameRegex = new RegExp(`.*${matchWords[0]}.*`, `i`);
    const surNameRegex = new RegExp(`.*${matchWords[1]}.*`, `i`);

    matchedUsers = await User.find({
      $and: [
        { firstName: { $regex: firstNameRegex } },
        { surName: { $regex: surNameRegex } },
      ],
    });
  } else {
    const regex = new RegExp(`.*${match}.*`, `i`);
    matchedUsers = await User.find({
      $or: [{ firstName: { $regex: regex } }, { surName: { $regex: regex } }],
    });
  }

  const result = mapGqlUsers(matchedUsers);

  return result;
};

module.exports = {
  signUp,
  login,
  follow,
  unfollow,
  getUser,
  getMatchingUsers,
};
