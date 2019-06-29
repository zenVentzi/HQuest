import jsonwebtoken from "jsonwebtoken";
import { QueryResolvers, MutationResolvers } from "../autoGenTypes";
import { mapUser, mapUsers } from "./gqlMapper";
import { authMiddleware } from "../middlewares";

type Query = Required<
  Pick<
    QueryResolvers,
    "user" | "users" | "rankings" | "followers" | "following"
  >
>;

type Mutation = Required<
  Pick<
    MutationResolvers,
    "login" | "deleteAccount" | "editUser" | "follow" | "uploadAvatar"
  >
>;

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
  async rankings(_, {}, { services, user }) {
    authMiddleware(user);

    const dbUsers = await services.user.getRankings();
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
    const gqlUser = mapUser(dbUser, "", true);
    const result = {
      authToken,
      user: gqlUser
    };

    return result;
  },

  async deleteAccount(_, __, { services, user }) {
    authMiddleware(user);

    await services.user.deleteAccount(user!.id);
    await services.answer.onDeleteAccount(user!.id);
    await services.comment.onDeleteAccount(user!.id);
    await services.newsfeed.onDeleteAccount(user!.id);
    await services.notification.onDeleteAccount(user!.id);
    return null;
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
      await services.notification.onNewFollower(userId, user!.id);
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
