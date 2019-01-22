import { UserQueryArgs, UsersQueryArgs, Maybe } from "../generated/gqltypes";
import * as FnTypes from "./userControllerTypes";
import * as DbTypes from "../dbTypes";
// import { Types as ModelTypes } from "../models/user";

const { ObjectId } = require("mongoose").Types;
const fs = require("fs");
const path = require("path");

const registerUser: FnTypes.RegisterUser = User => async ({ email, name }) => {
  const [firstName, surName] = name.split(" ");
  const id = ObjectId();

  const newUser = {
    _id: id,
    firstName,
    surName,
    email,
    intro: "Hey, I am an intro",
    avatarSrc: `/public/images/avatar${id}.jpeg`,
    socialMediaLinks: {
      facebookLink: "",
      twitterLink: "",
      instagramLink: "",
      linkedInLink: ""
    }
  };

  const userDoc = await User.create(newUser);
  return userDoc;
  // return userDoc.toObject();
};

const login: FnTypes.LoginUser = User => async ({ email, name }) => {
  const user = await User.findOne({
    email
  }).lean();

  if (!user) {
    return registerUser(User)({ email, name });
  }

  return user;
};

const followBaseFunc: FnTypes.FollowUserBase = User => async (
  { userId },
  follow,
  loggedUserId
) => {
  const followerId = loggedUserId;
  const followedId = userId;

  if (follow) {
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
      $pull: { following: ObjectId(followedId) }
    });
    await User.findByIdAndUpdate(followedId, {
      $pull: { followers: ObjectId(followerId) }
    });
  }
};

const follow: FnTypes.FollowUser = User => async (args, loggedUserId) => {
  await followBaseFunc(User)(args, true, loggedUserId);
};

const unfollow: FnTypes.UnfollowUser = User => async (args, loggedUserId) => {
  await followBaseFunc(User)(args, false, loggedUserId);
};

const getFollowers: FnTypes.GetFollowers = User => async ({ userId }) => {
  const user = await User.findById(userId);

  if (user) {
    const { followers: followersIds } = user;

    return User.find({
      _id: {
        $in: followersIds
      }
    }).lean();
  }

  return null;
};

const getFollowing: FnTypes.GetFollowing = User => async ({ userId }) => {
  const user = await User.findById(userId);

  if (user) {
    const { following: followingIds } = user;

    return User.find({
      _id: {
        $in: followingIds
      }
    }).lean();
  }

  return null;
};

const editUser: FnTypes.EditUser = User => async ({ input }, loggedUserId) => {
  const { fullName, intro, socialMediaLinks } = input!;

  const [firstName, surName] = fullName.split(" ");
  const update = { $set: { firstName, surName, intro, socialMediaLinks } };
  const editedUser = await User.findByIdAndUpdate(loggedUserId, update, {
    new: true,
    upsert: true
  });

  return editedUser;
};

const getUser: FnTypes.GetUser = User => async ({ id }) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error(`User with id ${id} was not found`);
  }

  return user;
};

const getUsersWithIds: FnTypes.GetUsersWithIds = User => async ({ ids }) => {
  const users = await User.find({ _id: { $in: ids } });
  // return null;
  return users;
};

const getUsers: FnTypes.GetUsers = User => async ({ match }) => {
  const matchWords = match!.split(" ");

  let matchedUsers: DbTypes.User[];
  const numOfWords = matchWords.length;

  if (numOfWords > 2) {
    return [];
  } else if (numOfWords === 2) {
    const firstNameRegex = new RegExp(`.*${matchWords[0]}.*`, `i`);
    const surNameRegex = new RegExp(`.*${matchWords[1]}.*`, `i`);

    matchedUsers = await User.find({
      $and: [
        { firstName: { $regex: firstNameRegex } },
        { surName: { $regex: surNameRegex } }
      ]
    });
  } else {
    const regex = new RegExp(`.*${match}.*`, `i`);
    matchedUsers = await User.find({
      $or: [{ firstName: { $regex: regex } }, { surName: { $regex: regex } }]
    });
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
    fs.writeFile(`${process.cwd()}${src}`, base64Img, "base64", err => {
      resolve(src);
    });
  });
};

const uploadAvatar: FnTypes.UploadAvatar = User => async (
  { base64Img },
  loggedUserId
) => {
  const avatarSrc = (await saveAvatarToFile(base64Img, loggedUserId)) as string;
  return avatarSrc;
};

export default User => {
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
    uploadAvatar: uploadAvatar(User)
  };
};
