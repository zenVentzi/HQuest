import jsonwebtoken from "jsonwebtoken";
import { Query, Mutation } from "./types";
import { mapUser, mapUsers } from "./gqlMapper";
import {
  userService,
  newsfeedService,
  notificationService
} from "../../services";

const Query: Query = {
  async user(_, args, context) {
    const dbUser = await userService.getUser(args, context);

    if (!dbUser) {
      return null;
    }

    const gqlUser = mapUser(dbUser, context.user!.id);
    return gqlUser;
  },
  async users(_, args, context) {
    const dbUsers = await userService.getUsers(args, context);
    const gqlUsers = mapUsers({
      dbUsers,
      loggedUserId: context.user!.id
    });

    return gqlUsers;
  },
  async followers(_, { userId }, context) {
    const dbFollowers = await userService.getFollowers({ userId }, context);
    return mapUsers({
      dbUsers: dbFollowers,
      loggedUserId: context.user!.id
    });
  },
  async following(_, { userId }, context) {
    const dbFollowing = await userService.getFollowing({ userId }, context);
    return mapUsers({
      dbUsers: dbFollowing,
      loggedUserId: context.user!.id
    });
  }
};

const Mutation: Mutation = {
  async login(_, args, context) {
    const dbUser = await userService.login(args, context);

    const authToken = jsonwebtoken.sign(
      { id: dbUser._id.toString(), email: dbUser.email },
      process.env.JWT_SECRET as jsonwebtoken.Secret,
      {
        expiresIn: "1d"
      }
    );
    const result = {
      authToken,
      userId: dbUser._id.toString()
    };

    return result;
  },
  async editUser(_, args, context) {
    const editedUser = await userService.editUser(args.input!, context);
    const gqlUser = mapUser(editedUser, context.user!.id);
    return gqlUser;
  },
  async follow(_, args, context) {
    if (args.follow) {
      await userService.follow(args, context);
      await newsfeedService.onFollowUser(
        args.userId,
        context.user!.id,
        context
      );
      await notificationService.newFollower(
        { receiverId: args.userId },
        context
      );
    } else {
      await userService.unfollow(args, context);
    }

    return args.follow; // fix: this is not needed
  },
  async uploadAvatar(_, args, context) {
    const avatarSrc = await userService.uploadAvatar(args, context);
    return avatarSrc;
  }
};

export default { Query, Mutation };
