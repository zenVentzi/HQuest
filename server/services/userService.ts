import fs from "fs";
import { ApolloContext, User } from "gqlContext";
import { Types } from "mongoose";
import path from "path";
import * as DbTypes from "../dbTypes";
import * as GqlTypes from "../generated/gqltypes";

const { ObjectId } = Types;

async function registerUser(
  { email, name }: GqlTypes.LoginMutationArgs,
  { models }: ApolloContext
): Promise<DbTypes.User> {
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

  const userDoc = await models.user.create(newUser);
  return userDoc.toObject();
}

async function login(
  { email, name }: GqlTypes.LoginMutationArgs,
  context: ApolloContext
): Promise<DbTypes.User> {
  const user = await context.models.user
    .findOne({
      email
    })
    .lean();

  if (!user) {
    return registerUser({ email, name }, context);
  }

  return user;
}

async function followBaseFunc(
  { userId }: GqlTypes.FollowMutationArgs,
  shouldFollow: boolean,
  { models, user }: ApolloContext
): Promise<void> {
  const followerId = user!.id;
  const followedId = userId;

  if (shouldFollow) {
    await models.user.findByIdAndUpdate(
      followerId,
      { $push: { following: ObjectId(followedId) } },
      { new: true, upsert: true }
    );
    await models.user.findByIdAndUpdate(
      followedId,
      { $push: { followers: ObjectId(followerId) } },
      { new: true, upsert: true }
    );
  } else {
    await models.user.findByIdAndUpdate(followerId, {
      $pull: { following: ObjectId(followedId) }
    });
    await models.user.findByIdAndUpdate(followedId, {
      $pull: { followers: ObjectId(followerId) }
    });
  }
}

async function follow(
  args: GqlTypes.FollowMutationArgs,
  context: ApolloContext
): Promise<void> {
  await followBaseFunc(args, true, context);
}

async function unfollow(
  args: GqlTypes.FollowMutationArgs,
  context: ApolloContext
): Promise<void> {
  await followBaseFunc(args, false, context);
}

async function getFollowers(
  { userId }: GqlTypes.FollowersQueryArgs,
  { models }: ApolloContext
): Promise<DbTypes.User[] | null> {
  const userDoc = await models.user.findById(userId).populate("followers");
  if (!userDoc) {
    return null;
  }
  const { followers } = userDoc.toObject<true>();
  return followers && followers.length ? followers : null;
}

async function getFollowing(
  { userId }: GqlTypes.FollowingQueryArgs,
  { models }: ApolloContext
): Promise<DbTypes.User[] | null> {
  const userDoc = await models.user.findById(userId).populate("following");
  if (!userDoc) {
    return null;
  }
  const { following } = userDoc.toObject<true>();
  return following && following.length ? following : null;
}

async function editUser(
  { fullName, intro, socialMediaLinks }: GqlTypes.EditUserInput,
  { models, user }: ApolloContext
) {
  const [firstName, surName] = fullName.split(" ");
  const update = { $set: { firstName, surName, intro, socialMediaLinks } };
  const editedUser = await models.user.findByIdAndUpdate(user!.id, update, {
    new: true,
    upsert: true
  });

  return editedUser;
}

async function getUser(
  { id }: GqlTypes.UserQueryArgs,
  { models }: ApolloContext
): Promise<DbTypes.User | null> {
  const user = await models.user.findById(id);
  return user ? user.toObject() : null;
}

async function getUsersWithIds(
  { ids }: { ids: string[] },
  { models }: ApolloContext
): Promise<DbTypes.User[]> {
  const users = await models.user.find({ _id: { $in: ids } }).lean();
  return users;
}

async function getUsers(
  { match }: GqlTypes.UsersQueryArgs,
  { models }: ApolloContext
): Promise<DbTypes.User[]> {
  const matchWords = match!.split(" ");

  let matchedUsers: DbTypes.UserDoc[];
  const numOfWords = matchWords.length;

  if (numOfWords > 2) {
    return [];
  } else if (numOfWords === 2) {
    const firstNameRegex = new RegExp(`.*${matchWords[0]}.*`, `i`);
    const surNameRegex = new RegExp(`.*${matchWords[1]}.*`, `i`);

    matchedUsers = await models.user.find({
      $and: [
        { firstName: { $regex: firstNameRegex } },
        { surName: { $regex: surNameRegex } }
      ]
    });
  } else {
    const regex = new RegExp(`.*${match}.*`, `i`);
    matchedUsers = await models.user.find({
      $or: [{ firstName: { $regex: regex } }, { surName: { $regex: regex } }]
    });
  }

  return matchedUsers;
}

// extract in utils
const ensureDirectoryExistence = filePath => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

async function saveAvatarToFile(
  base64Img: string,
  userId: string
): Promise<string> {
  const src = `/public/images/avatar${userId}.jpeg`;
  ensureDirectoryExistence(`${process.cwd()}${src}`);

  return new Promise(resolve => {
    fs.writeFile(`${process.cwd()}${src}`, base64Img, "base64", err => {
      resolve(src);
    });
  });
}

async function uploadAvatar(
  { base64Img }: GqlTypes.UploadAvatarMutationArgs,
  { user }: ApolloContext
): Promise<string> {
  const avatarSrc = await saveAvatarToFile(base64Img, user!.id);
  return avatarSrc;
}

export const userService = {
  login,
  editUser,
  follow,
  unfollow,
  getFollowers,
  getFollowing,
  getUser,
  getUsers,
  getUsersWithIds,
  uploadAvatar
};
