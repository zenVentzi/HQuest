import * as gqlTypes from "../autoGenTypes";
import { mapNewsfeed } from "./gqlMapper";
import { ApolloContext } from "gqlContext";
import { authMiddleware } from "../middlewares";

const NewsBase: gqlTypes.NewsBaseResolvers = {
  __resolveType(obj, context: ApolloContext, info) {
    authMiddleware(context.user);

    switch (obj.type) {
      case gqlTypes.NewsType.NewAnswer:
      case gqlTypes.NewsType.NewAnswerEdition:
        return "AnswerNews";
      case gqlTypes.NewsType.NewComment:
        return "CommentNews";
      case gqlTypes.NewsType.EditionLike:
        return "EditionLikeNews";
      case gqlTypes.NewsType.CommentLike:
        return "CommentLikeNews";
      case "NEW_FOLLOWER":
        return "NewFollowerNews";

      default:
        throw new Error(`${obj.type} is incorrect`);
    }
  }
};

const News: gqlTypes.NewsResolvers = {
  __resolveType(obj, context, info) {
    authMiddleware(context.user);

    switch (obj.type) {
      case gqlTypes.NewsType.NewAnswer:
      case gqlTypes.NewsType.NewAnswerEdition:
        return "AnswerNews";
      case gqlTypes.NewsType.NewComment:
        return "CommentNews";
      case gqlTypes.NewsType.EditionLike:
        return "EditionLikeNews";
      case gqlTypes.NewsType.CommentLike:
        return "CommentLikeNews";
      case "NEW_FOLLOWER":
        return "NewFollowerNews";

      default:
        throw new Error(`${obj.type} is incorrect`);
    }
  }
};

type Query = Pick<gqlTypes.QueryResolvers, "newsfeed">;

const Query: Query = {
  async newsfeed(_, __, { services, user }) {
    authMiddleware(user);

    const newsfeedDb = await services.newsfeed.getNewsfeed(user!.id);
    const newsfeedQuestions = await services.newsfeed.getNewsFeedQuestions(
      newsfeedDb,
      services.answer
    );
    const newsfeedUsers = await services.newsfeed.getNewsFeedUsers(newsfeedDb);

    const gqlNewsfeed = mapNewsfeed(
      newsfeedDb,
      newsfeedUsers,
      newsfeedQuestions,
      user!.id
    );

    return gqlNewsfeed;
  }
};

export { NewsBase, News, Query };
