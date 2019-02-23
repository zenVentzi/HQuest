import jsonwebtoken from "jsonwebtoken";
import { Query, Mutation } from "./types";
import { mapUser, mapUsers } from "./gqlMapper";
import { authMiddleware } from "../middlewares";

const Query: Query = {
  async user(_, { id }, { services, user }) {
    authMiddleware(user);

    const dbUser = await services.user.getUser(id);

    if (!dbUser) {
      return null;
    }

    const gqlUser = mapUser(dbUser, user!.id);
    return gqlUser;
  },
  async users(_, { match }, { services, user }) {
    authMiddleware(user);

    const dbUsers = await services.user.getUsers(match!);
    const gqlUsers = mapUsers({
      dbUsers,
      loggedUserId: user!.id
    });

    return gqlUsers;
  },
  async followers(_, { userId }, { services, user }) {
    authMiddleware(user);

    const dbFollowers = await services.user.getFollowers(userId);
    return mapUsers({
      dbUsers: dbFollowers,
      loggedUserId: user!.id
    });
  },
  async following(_, { userId }, { services, user }) {
    const dbFollowing = await services.user.getFollowing(userId);
    return mapUsers({
      dbUsers: dbFollowing,
      loggedUserId: user!.id
    });
  }
};

const Mutation: Mutation = {
  async login(_, { email, name }, { services, user }) {
    const dbUser = await services.user.login(email, name);

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

  async editUser(_, { input }, { services, user }) {
    authMiddleware(user);

    const editedUser = await services.user.editUser(
      user!.id,
      input!.fullName,
      input!.intro,
      input!.socialMediaLinks
    );
    const gqlUser = mapUser(editedUser, user!.id);
    return gqlUser;
  },
  async follow(_, { follow, userId }, { services, user }) {
    authMiddleware(user);

    if (follow) {
      await services.user.follow(user!.id, userId);
      await services.newsfeed.onFollowUser(userId, user!.id);
      await services.notification.newFollower(userId, user!.id);
    } else {
      await services.user.unfollow(user!.id, userId);
    }

    return follow; // fix: this is not needed
  },
  async uploadAvatar(_, { base64Img }, { services, user }) {
    authMiddleware(user);

    const avatarSrc = await services.user.uploadAvatar(base64Img, user!.id);
    return avatarSrc;
  }
};

export { Query, Mutation };
