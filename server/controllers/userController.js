const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const path = require('path');

const registerUser = User => async ({ email, name }) => {
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
  return userDoc.toObject();
};

const login = User => async ({ email, name }) => {
  const user = await User.findOne({
    email,
  }).lean();

  if (!user) {
    return registerUser(User)({ email, name });
  }

  return user;
};

const followBaseFunc = User => async (
  { userId, follow: addFollower },
  loggedUserId
) => {
  const followerId = loggedUserId;
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

const follow = User => async ({ userId, loggedUserId }) => {
  await followBaseFunc(User)({ userId, follow: true }, loggedUserId);
};

const unfollow = User => async ({ userId, loggedUserId }) => {
  await followBaseFunc(User)({ userId, follow: false }, loggedUserId);
};

const getFollowers = User => async ({ userId }) => {
  const { followers: followersIds } = await User.findById(userId).lean();
  const followers = await User.find({
    _id: {
      $in: followersIds,
    },
  }).lean();
  return followers;
};

const getFollowing = User => async ({ userId }) => {
  const { following: followingIds } = await User.findById(userId).lean();
  const following = await User.find({
    _id: {
      $in: followingIds,
    },
  }).lean();

  return following;
};

const editUser = User => async ({ input, loggedUserId }) => {
  const { fullName, intro, socialMediaLinks } = input;

  const [firstName, surName] = fullName.split(' ');
  const update = { $set: { firstName, surName, intro, socialMediaLinks } };
  const editedUser = await User.findByIdAndUpdate(loggedUserId, update, {
    new: true,
    upsert: true,
  }).lean();

  return editedUser;
};

const getUser = User => async ({ userId }) => {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new Error(`User with id ${userId} was not found`);
  }

  return user;
};

const getUsersWithIds = User => async ({ ids }) => {
  const users = await User.find({ _id: { $in: ids } }).lean();
  return users;
};

const getUsers = User => async ({ match }) => {
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

  return matchedUsers;
};

// extract in utils
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

const uploadAvatar = User => async ({ base64Img, context }) => {
  const { user } = context;

  const avatarSrc = await saveAvatarToFile(base64Img, user.id);
  return avatarSrc;
};

module.exports = User => {
  return {
    login: login(User),
    editUser: editUser(User),
    follow: follow(User),
    unfollow: unfollow(User),
    getFollowers: getFollowers(User),
    getFollowing: getFollowing(User),
    getUser: getUser(User),
    getUsers: getUsers(User),
    getUsersWithIds: getUsersWithIds(User),
    uploadAvatar: uploadAvatar(User),
  };
};
