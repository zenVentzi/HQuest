const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const path = require('path');
const { mapGqlUser, mapGqlUsers } = require('../resolvers/helper');

const registerUser = async ({ email, name }, context) => {
  const {
    models: { User },
  } = context;

  const [firstName, surName] = name.split(' ');
  const id = ObjectId();

  const newUser = {
    _id: id,
    firstName,
    surName,
    email,
    intro: 'Hey, I am an intro',
    avatarSrc: `/public/images/avatar${id}.jpeg`,
    socialMediaLinks: {
      facebookLink: '',
      twitterLink: '',
      instagramLink: '',
      linkedInLink: '',
    },
  };

  const userDoc = await User.create(newUser);
  return mapGqlUser({ user: userDoc.toObject(), loggedUserId: id.toString() });
};

const login = async ({ email, name }, context) => {
  const {
    models: { User },
  } = context;

  const user = await User.findOne({
    email,
  }).lean();

  if (!user) {
    return registerUser({ email, name }, context);
  }

  return mapGqlUser({ user, loggedUserId: user._id.toString() });
};

const followBaseFunc = async ({ userId, follow: addFollower }, context) => {
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
  await followBaseFunc({ userId, follow: true }, context);
};

const unfollow = async (userId, context) => {
  await followBaseFunc({ userId, follow: false }, context);
};

async function getFollowers(userId, context) {
  const {
    models: { User },
    user,
  } = context;

  const { followers: followersIds } = await User.findById(userId).lean();
  const followers = await User.find({
    _id: {
      $in: followersIds,
    },
  }).lean();
  return mapGqlUsers({ users: followers, loggedUserId: user.id });
}

async function getFollowing(userId, context) {
  const {
    models: { User },
    user,
  } = context;

  const { following: followingIds } = await User.findById(userId).lean();
  const following = await User.find({
    _id: {
      $in: followingIds,
    },
  }).lean();
  return mapGqlUsers({ users: following, loggedUserId: user.id });
}

const editUser = async (input, context) => {
  const {
    models: { User },
    user,
  } = context;
  const { fullName, intro, socialMediaLinks } = input;

  const [firstName, surName] = fullName.split(' ');
  const update = { $set: { firstName, surName, intro, socialMediaLinks } };
  const updatedUser = await User.findByIdAndUpdate(user.id, update, {
    new: true,
    upsert: true,
  }).lean();

  return mapGqlUser({ user: updatedUser, loggedUserId: user.id });
};

const getUser = async (userId, context) => {
  const {
    models: { User },
    user: loggedUser,
  } = context;
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new Error(`User with id ${userId} was not found`);
  }

  return mapGqlUser({ user, loggedUserId: loggedUser.id });
};

const getUsersWithIds = async ({ ids, context }) => {
  const {
    models: { User },
  } = context;

  const users = await User.find({ _id: { $in: ids } }).lean();

  return users;
};

const getUsers = async (match, context) => {
  const {
    models: { User },
    user,
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

  return mapGqlUsers({ users: matchedUsers, loggedUserId: user.id });
};

const ensureDirectoryExistence = filePath => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

const saveAvatarToFile = async (base64Img, userId) => {
  const src = `/public/images/avatar${userId}.jpeg`;
  ensureDirectoryExistence(`${process.cwd()}${src}`);

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
  login,
  editUser,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  getUsers,
  getUsersWithIds,
  uploadAvatar,
};
