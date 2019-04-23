import * as gqlTypes from "../autoGenTypes";
import { User } from "../autoGenTypes";
// import * as questionTypes from "../autoGenTypes";
import * as dbTypes from "../../dbTypes";
import { mapUser, mapUsers } from "../user/gqlMapper";
import {
  mapAnsweredQuestions,
  mapAnsweredQuestion
} from "../question/gqlMapper";

type MapNews = (
  news: dbTypes.News,
  newsfeedUsers: User[],
  newsfeedQuestions: dbTypes.AnsweredQuestion[],
  loggedUserId: string
) => gqlTypes.NewsBase;

const mapNews: MapNews = (
  news,
  newsfeedUsers,
  newsfeedQuestions,
  loggedUserId
) => {
  // some repetition down there could use some refactoring
  const createdOn = news._id.getTimestamp();
  const performer = newsfeedUsers.find(u => u.id === news.performerId);
  if (!performer) {
    throw Error(`performer not found`);
  }

  let answerOwner: User | undefined;

  if (news.type === dbTypes.NewsType.NewFollower) {
    const followedUser = newsfeedUsers.find(u => u.id === news.followedUserId);

    if (!followedUser) {
      throw Error(`followedUser not found`);
    }

    const gqlNews: gqlTypes.NewFollowerNews = {
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
    const question = newsfeedQuestions.find(q =>
      q.answer._id.equals(news.answerId)
    );

    if (!question) {
      throw Error("question was not found");
    }

    const gqlQuestion = mapAnsweredQuestion(question, loggedUserId);

    if (news.type === dbTypes.NewsType.EditionLike) {
      const gqlNews: gqlTypes.EditionLikeNews = {
        type: news.type,
        createdOn,
        performer,
        answerOwner,
        question: gqlQuestion,
        editionId: news.editionId
      };
      return gqlNews;
    } else if (news.type === dbTypes.NewsType.CommentLike) {
      const gqlNews: gqlTypes.CommentLikeNews = {
        type: news.type,
        createdOn,
        performer,
        answerOwner,
        question: gqlQuestion,
        editionId: news.editionId,
        commentId: news.commentId
      };
      return gqlNews;
    } else if (news.type === dbTypes.NewsType.NewAnswerEdition) {
      const gqlNews: gqlTypes.NewAnswerEditionNews = {
        createdOn,
        type: news.type,
        performer,
        answerOwner,
        question: gqlQuestion
      };
      return gqlNews;
    } else if (news.type === dbTypes.NewsType.NewComment) {
      const gqlNews: gqlTypes.NewCommentNews = {
        createdOn,
        type: news.type,
        commentId: news.commentId,
        performer,
        answerOwner,
        question: gqlQuestion,
        editionId: news.editionId
      };
      return gqlNews;
    }
  }

  throw Error(`unreachable path`);

  // return assertUnreachable(news.type);
};

function assertUnreachable(x?: dbTypes.NewsType): never {
  throw new Error(`Didn't expect to get here for type ${x}`);
}

type GetNewsfeed = (
  newsFeed: dbTypes.Newsfeed | null,
  newsFeedUsers: dbTypes.User[],
  newsFeedQuestions: dbTypes.AnsweredQuestion[] | null,
  loggedUserId: string
) => gqlTypes.NewsBase[] | null;

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
  // const newsfeedQuestionsGql = mapAnsweredQuestions(
  //   newsfeedQuestions,
  //   loggedUserId
  // );

  const newsfeedGql = newsfeed.map(news =>
    mapNews(news, newsfeedUsersGql, newsfeedQuestions!, loggedUserId)
  );

  return newsfeedGql;
};

export { mapNews, mapNewsfeed };
