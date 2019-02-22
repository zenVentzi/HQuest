import { Query } from "./types";
import { mapNewsfeed } from "./gqlMapper";
import { newsfeedService } from "../../services";

const NewsBase = {
  __resolveType(obj, context, info) {
    switch (obj.type) {
      case "NEW_ANSWER":
      case "NEW_ANSWER_EDITION":
        return "AnswerNews";
      case "NEW_COMMENT":
        return "CommentNews";
      case "NEW_LIKE":
        return "NewLikeNews";
      case "NEW_FOLLOWER":
        return "NewFollowerNews";

      default:
        throw new Error(`${obj.type} is incorrect`);
    }
  }
};

const News = {
  __resolveType(obj, context, info) {
    switch (obj.type) {
      case "NEW_ANSWER":
      case "NEW_ANSWER_EDITION":
        return "AnswerNews";
      case "NEW_COMMENT":
        return "CommentNews";
      case "NEW_LIKE":
        return "NewLikeNews";
      case "NEW_FOLLOWER":
        return "NewFollowerNews";

      default:
        throw new Error(`${obj.type} is incorrect`);
    }
  }
};

const Query: Query = {
  async newsfeed(_, __, context) {
    const newsfeedDb = await newsfeedService.getNewsfeed(context);
    const newsfeedQuestions = await newsfeedService.getNewsFeedQuestions(
      newsfeedDb,
      context
    );
    const newsfeedUsers = await newsfeedService.getNewsFeedUsers(
      newsfeedDb,
      context
    );

    const gqlNewsfeed = mapNewsfeed(
      newsfeedDb,
      newsfeedUsers,
      newsfeedQuestions,
      context.user!.id
    );

    return gqlNewsfeed;
  }
};

export { NewsBase, News, Query };
