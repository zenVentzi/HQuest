import fs from "fs";
import { ApolloContext, User } from "gqlContext";
import { Types } from "mongoose";
import path from "path";
import * as DbTypes from "../dbTypes";
import * as GqlTypes from "../generated/gqltypes";
import { Models } from "../models";

const { ObjectId } = Types;

class UserService {
  constructor(private models: Models) {}

  public async login(
    { email, name }: GqlTypes.LoginMutationArgs,
    context: ApolloContext
  ): Promise<DbTypes.User> {
    const user = await context.models.user
      .findOne({
        email
      })
      .lean();

    if (!user) {
      return this.registerUser({ email, name }, context);
    }

    return user;
  }

  public async follow(
    args: GqlTypes.FollowMutationArgs,
    context: ApolloContext
  ): Promise<void> {
    await this.followBaseFunc(args, true, context);
  }

  public async unfollow(
    args: GqlTypes.FollowMutationArgs,
    context: ApolloContext
  ): Promise<void> {
    await this.followBaseFunc(args, false, context);
  }

  public async getFollowers(
    { userId }: GqlTypes.FollowersQueryArgs,
    { models }: ApolloContext
  ): Promise<DbTypes.User[] | null> {
    const userDoc = await models.user.findById(userId).populate("followers");
    if (!userDoc) {
      return null;
    }
    const { followers } = userDoc.toObject<"followers">();
    return followers && followers.length ? followers : null;
  }

  public async getFollowing(
    { userId }: GqlTypes.FollowingQueryArgs,
    { models }: ApolloContext
  ): Promise<DbTypes.User[] | null> {
    const userDoc = await models.user.findById(userId).populate("following");
    if (!userDoc) {
      return null;
    }
    const { following } = userDoc.toObject<"following">();
    return following && following.length ? following : null;
  }

  public async editUser(
    { fullName, intro, socialMediaLinks }: GqlTypes.EditUserInput,
    { models, user }: ApolloContext
  ): Promise<DbTypes.User> {
    const [firstName, surName] = fullName.split(" ");
    const update = { $set: { firstName, surName, intro, socialMediaLinks } };
    const editedUser = await models.user.findByIdAndUpdate(user!.id, update, {
      new: true,
      upsert: true
    });

    return editedUser.toObject();
  }

  public async getUser(
    { id }: GqlTypes.UserQueryArgs,
    { models }: ApolloContext
  ): Promise<DbTypes.User<"noPopulatedFields"> | null> {
    const user = await models.user.findById(id);
    return user ? user.toObject() : null;
  }

  public async getUsersWithIds(
    { ids }: { ids: string[] },
    { models }: ApolloContext
  ): Promise<DbTypes.User[]> {
    const users = await models.user.find({ _id: { $in: ids } }).lean();
    return users;
  }

  public async getUsers(
    { match }: GqlTypes.UsersQueryArgs,
    { models }: ApolloContext
  ): Promise<DbTypes.User[] | null> {
    const matchWords = match!.split(" ");

    let matchedUsers: DbTypes.User[];
    const numOfWords = matchWords.length;

    if (numOfWords > 2) {
      return null;
    } else if (numOfWords === 2) {
      const firstNameRegex = new RegExp(`.*${matchWords[0]}.*`, `i`);
      const surNameRegex = new RegExp(`.*${matchWords[1]}.*`, `i`);

      matchedUsers = await models.user
        .find({
          $and: [
            { firstName: { $regex: firstNameRegex } },
            { surName: { $regex: surNameRegex } }
          ]
        })
        .lean();
    } else {
      const regex = new RegExp(`.*${match}.*`, `i`);
      matchedUsers = await models.user
        .find({
          $or: [
            { firstName: { $regex: regex } },
            { surName: { $regex: regex } }
          ]
        })
        .lean();
    }

    return matchedUsers;
  }

  public async uploadAvatar(
    { base64Img }: GqlTypes.UploadAvatarMutationArgs,
    { user }: ApolloContext
  ): Promise<string> {
    const avatarSrc = await this.saveAvatarToFile(base64Img, user!.id);
    return avatarSrc;
  }

  private async saveAvatarToFile(
    base64Img: string,
    userId: string
  ): Promise<string> {
    const src = `/public/images/avatar${userId}.jpeg`;
    this.ensureDirectoryExistence(`${process.cwd()}${src}`);

    return new Promise(resolve => {
      fs.writeFile(`${process.cwd()}${src}`, base64Img, "base64", err => {
        resolve(src);
      });
    });
  }

  // extract in utils
  private ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  private async registerUser(
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

  private async followBaseFunc(
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
}

export { UserService };
