const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
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

const followBase = async ({ userId, follow: addFollower }, context) => {
  const {
    models: { User },
    user,
  } = context;

  const followerId = user.id;
  const followedId = userId;

  if (addFollower) {
    await User.findByIdAndUpdate(
      followerId,
      { $push: { following: ObjectId(followedId) } },
      { new: true, upsert: true }
    );
    await User.findByIdAndUpdate(
      followedId,
      { $push: { followers: ObjectId(followerId) } },
      { new: true, upsert: true }
    );
  } else {
    await User.findByIdAndUpdate(followerId, {
      $pull: { following: ObjectId(followedId) },
    });
    await User.findByIdAndUpdate(followedId, {
      $pull: { followers: ObjectId(followerId) },
    });
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

const getUsers = async (match, context) => {
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
    }).lean();
  } else {
    const regex = new RegExp(`.*${match}.*`, `i`);
    matchedUsers = await User.find({
      $or: [{ firstName: { $regex: regex } }, { surName: { $regex: regex } }],
    }).lean();
  }

  return mapGqlUsers(context, matchedUsers);
};

const saveAvatarToFile = async (base64Img, userId) => {
  const src = `/public/images/avatar${userId}.jpeg`;

  return new Promise(resolve => {
    fs.writeFile(`${process.cwd()}${src}`, base64Img, 'base64', err => {
      resolve(src);
    });
  });
};

const uploadAvatar = async (base64Img, context) => {
  const {
    models: { User },
    user,
  } = context;

  const { collections } = context;
  const avatarSrc = await saveAvatarToFile(base64Img, user.id);
  await User.findByIdAndUpdate(user.id, { $set: { avatarSrc } });
  return avatarSrc;
};

module.exports = {
  signUp,
  login,
  follow,
  unfollow,
  getUser,
  getUsers,
  uploadAvatar,
};
