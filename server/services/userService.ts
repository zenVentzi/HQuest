import fs from "fs";
import cloudinary from "cloudinary";
import { ApolloContext, ContextUser } from "gqlContext";
import { Types } from "mongoose";
import path from "path";
import * as DbTypes from "../dbTypes";
// import * as GqlTypes from "../generated/gqltypes";
import { Models } from "../models";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const { ObjectId } = Types;

class UserService {
  constructor(private models: Models) {}

  public async login(email: string, name: string): Promise<DbTypes.User> {
    const user = await this.models.user
      .findOne({
        email
      })
      .lean();

    if (!user) {
      return this.registerUser({ email, name });
    }

    return user;
  }

  public async deleteAccount(userId: string): Promise<void> {
    await this.models.user.deleteOne({ _id: userId });

    const allUsers = await this.models.user.find();
    for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
      const user = allUsers[userIndex];

      if (user.followers) {
        user.followers = user.followers.filter(
          fwerId => fwerId.toHexString() !== userId
        );
      }
      if (user.following) {
        user.following = user.following.filter(
          fwingId => fwingId.toHexString() !== userId
        );
      }

      if (user.isModified()) {
        await user.save();
      }
    }
  }

  public async follow(followerId: string, followedId: string): Promise<void> {
    await this.followBaseFunc(followerId, followedId, true);
  }

  public async unfollow(followerId: string, followedId: string): Promise<void> {
    await this.followBaseFunc(followerId, followedId, false);
  }

  public async getFollowers(userId: string): Promise<DbTypes.User[] | null> {
    const userDoc = await this.models.user
      .findById(userId)
      .populate(DbTypes.UserPopulatedFields.followers);
    if (!userDoc) {
      return null;
    }
    const { followers } = userDoc.toObject<
      DbTypes.UserPopulatedFields.followers
    >();
    return followers && followers.length ? followers : null;
  }

  public async getFollowing(userId: string): Promise<DbTypes.User[] | null> {
    const userDoc = await this.models.user
      .findById(userId)
      .populate(DbTypes.UserPopulatedFields.following);
    if (!userDoc) {
      return null;
    }
    const { following } = userDoc.toObject<
      DbTypes.UserPopulatedFields.following
    >();
    return following && following.length ? following : null;
  }

  public async editUser(
    userId: string,
    fullName: string,
    intro: string,
    socialMediaLinks: {
      facebookLink?: string | null;
      twitterLink?: string | null;
      instagramLink?: string | null;
      linkedInLink?: string | null;
    }
  ): Promise<DbTypes.User> {
    const [firstName, surName] = fullName.split(" ");
    const update = { $set: { firstName, surName, intro, socialMediaLinks } };
    const editedUser = await this.models.user.findByIdAndUpdate(
      userId,
      update,
      {
        new: true,
        upsert: true
      }
    );

    return editedUser.toObject();
  }

  public async getUser(id: string): Promise<DbTypes.User | null> {
    const user = await this.models.user.findById(id);
    return user ? user.toObject() : null;
  }

  public async getUsersWithIds({
    ids
  }: {
    ids: string[];
  }): Promise<DbTypes.User[]> {
    const users = await this.models.user.find({ _id: { $in: ids } }).lean();
    return users;
  }

  public async getUsers(match: string): Promise<DbTypes.User[] | null> {
    const matchWords = match.split(" ");

    let matchedUsers: DbTypes.User[];
    const numOfWords = matchWords.length;

    if (numOfWords > 2) {
      return null;
    } else if (numOfWords === 2) {
      const firstNameRegex = new RegExp(`.*${matchWords[0]}.*`, `i`);
      const surNameRegex = new RegExp(`.*${matchWords[1]}.*`, `i`);

      matchedUsers = await this.models.user
        .find({
          $and: [
            { firstName: { $regex: firstNameRegex } },
            { surName: { $regex: surNameRegex } }
          ]
        })
        .lean();
    } else {
      const regex = new RegExp(`.*${match}.*`, `i`);
      matchedUsers = await this.models.user
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
  public async getRankings(): Promise<DbTypes.User[] | null> {
    const users = await this.models.user
      .find()
      .sort({ experience: -1 })
      .lean();
    return users;
  }

  public async uploadAvatar(
    base64Img: string,
    userId: string
  ): Promise<string> {
    const imageUrl = await new Promise<string>((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        base64Img,
        {
          public_id: `avatar${userId}`
        },
        (err, image) => {
          if (err) {
            reject(err);
          } else {
            resolve(image.secure_url);
          }
        }
      );
    });

    const user = await this.models.user.findById(userId);
    if (!user) {
      throw Error(`Could not find user with id: ${userId}`);
    }

    user.avatarSrc = imageUrl;
    await user.save();

    return imageUrl;
  }

  public async addExperience(
    experience: number,
    userId: string
  ): Promise<void> {
    const user = await this.models.user.findById(userId);
    if (!user) {
      throw Error(`user not found, id: ${userId}`);
    }
    user.experience += experience;
    await user.save();
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
  private ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  private async registerUser({
    email,
    name
  }: {
    email: string;
    name: string;
  }): Promise<DbTypes.User> {
    const [firstName, surName] = name.split(" ");
    const id = ObjectId();

    const newUser: DbTypes.User = {
      _id: id,
      firstName,
      surName,
      email,
      intro: "Hey, I am an intro",
      // avatarSrc: `/public/images/avatar${id}.jpeg`,
      // avatarSrc: `/public/images/avatar${id}.jpeg`,
      socialMediaLinks: {
        facebookLink: "",
        twitterLink: "",
        instagramLink: "",
        linkedInLink: ""
      },
      experience: 0,
      role: DbTypes.UserRoles.User
    };

    const userDoc = await this.models.user.create(newUser);
    return userDoc.toObject();
  }

  private async followBaseFunc(
    followerId: string,
    followedId: string,
    shouldFollow: boolean
  ): Promise<void> {
    if (shouldFollow) {
      await this.models.user.findByIdAndUpdate(
        followerId,
        { $push: { following: ObjectId(followedId) } },
        { new: true, upsert: true }
      );
      await this.models.user.findByIdAndUpdate(
        followedId,
        { $push: { followers: ObjectId(followerId) } },
        { new: true, upsert: true }
      );
    } else {
      await this.models.user.findByIdAndUpdate(followerId, {
        $pull: { following: ObjectId(followedId) }
      });
      await this.models.user.findByIdAndUpdate(followedId, {
        $pull: { followers: ObjectId(followerId) }
      });
    }
  }
}

export { UserService };
