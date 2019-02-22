import { Query } from "./types";
import { mapNewsfeed } from "./gqlMapper";
import { newsfeedService } from "../../services";

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

export { Query };
