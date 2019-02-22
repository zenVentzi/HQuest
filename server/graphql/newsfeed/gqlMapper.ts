import * as newsfeedTypes from "./types";
import * as userTypes from "../user/types";
import * as questionTypes from "../question/types";
import * as dbTypes from "../../dbTypes";
import { mapUser, mapUsers } from "../user/gqlMapper";
import { mapQuestions } from "../question/gqlMapper";

type MapNews = (
  news: dbTypes.News,
  newsfeedUsers: userTypes.User[],
  newsfeedQuestions: questionTypes.Question[]
) => newsfeedTypes.News;

const mapNews: MapNews = (news, newsfeedUsers, newsfeedQuestions) => {
  // some repetition down there could use some refactoring
  const createdOn = news._id.getTimestamp();
  const performer = newsfeedUsers.find(u => u.id === news.performerId);
  if (!performer) {
    throw Error(`performer not found`);
  }

  let answerOwner: userTypes.User | undefined;

  if (news.type === dbTypes.NewsType.NewFollower) {
    const followedUser = newsfeedUsers.find(u => u.id === news.followedUserId);

    if (!followedUser) {
      throw Error(`followedUser not found`);
    }

    const gqlNews: newsfeedTypes.NewFollowerNews = {
      createdOn,
      type: news.type,
      performer,
      followedUser
    };

    return gqlNews;
  } else {
    answerOwner = newsfeedUsers.find(u => u.id === news.answerOwnerId);
    if (!answerOwner) {
      throw Error("answerOwner was not found");
    }
    const question = newsfeedQuestions.find(
      q => q.answer!.id === news.answerId
    );

    if (!question) {
      throw Error("question was not found");
    }

    if (news.type === dbTypes.NewsType.NewLike) {
      const gqlNews: newsfeedTypes.NewLikeNews = {
        type: news.type,
        createdOn,
        performer,
        answerOwner,
        question
      };
      return gqlNews;
    } else if (
      news.type === dbTypes.NewsType.NewAnswer ||
      news.type === dbTypes.NewsType.NewAnswerEdition
    ) {
      const gqlNews: newsfeedTypes.AnswerNews = {
        createdOn,
        type: news.type,
        performer,
        answerOwner,
        question
      };
      return gqlNews;
    } else if (news.type === dbTypes.NewsType.NewComment) {
      const gqlNews: newsfeedTypes.CommentNews = {
        createdOn,
        type: news.type,
        commentId: news.commentId,
        performer,
        answerOwner,
        question
      };
      return gqlNews;
    }
  }

  return assertUnreachable(news.type);
};

function assertUnreachable(x?: dbTypes.NewsType): never {
  throw new Error(`Didn't expect to get here for type ${x}`);
}

type GetNewsfeed = (
  newsFeed: dbTypes.Newsfeed | null,
  newsFeedUsers: dbTypes.User[],
  newsFeedQuestions: dbTypes.AnsweredQuestion[] | null,
  loggedUserId: string
) => newsfeedTypes.News[] | null;

const mapNewsfeed: GetNewsfeed = (
  newsfeed,
  newsfeedUsers,
  newsfeedQuestions,
  loggedUserId
) => {
  if (!newsfeed || !newsfeed.length) return null;
  const newsfeedHasQuestions = newsfeed.some(
    news => news.type !== dbTypes.NewsType.NewFollower
  );

  if (
    newsfeedHasQuestions &&
    (!newsfeedQuestions || !newsfeedQuestions.length)
  ) {
    throw Error("Newsfeed questions not provided");
  }

  const newsfeedUsersGql = mapUsers({ dbUsers: newsfeedUsers, loggedUserId });
  const newsfeedQuestionsGql = mapQuestions({
    dbQuestions: newsfeedQuestions,
    loggedUserId
  });

  const newsfeedGql = newsfeed.map(news =>
    mapNews(news, newsfeedUsersGql, newsfeedQuestionsGql!)
  );

  return newsfeedGql;
};

export { mapNews, mapNewsfeed };
