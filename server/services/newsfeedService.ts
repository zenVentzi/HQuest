import { ApolloContext } from "gqlContext";
import { Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";

const { ObjectId } = GooseTypes;

const NEW_ANSWER = "NEW_ANSWER";
const NEW_ANSWER_EDITION = "NEW_ANSWER_EDITION";
const NEW_COMMENT = "NEW_COMMENT";
const NEW_FOLLOWER = "NEW_FOLLOWER";
const NEW_LIKE = "NEW_LIKE";

type CheckLikedBefore = (
  news: DbTypes.News,
  context: ApolloContext
) => Promise<boolean>;

const checkLikedBefore: CheckLikedBefore = async (news, { models }) => {
  const existingNews = await models.newsfeed.findById(news._id);

  // old way
  // const existingNews = await models.newsfeed.findOne({
  //   type: news.type,
  //   performerId: news.performerId,
  //   answerId: news.answerId
  // }).lean();

  return !!existingNews;
};

type OnLikeAnswer = (
  answer: DbTypes.Answer,
  performerId: string,
  context: ApolloContext
) => Promise<void>;

const onLikeAnswer: OnLikeAnswer = async (answer, performerId, context) => {
  const news: DbTypes.NewLikeNews = {
    _id: ObjectId(),
    type: DbTypes.NewsType.NewLike,
    performerId,
    answerOwnerId: answer.userId.toString(),
    answerId: answer._id.toString()
  };

  if (!(await checkLikedBefore(news, context))) {
    await context.models.newsfeed.create(news);
  }
};

type OnFollowUser = (
  followedUserId: string,
  performerId: string,
  context: ApolloContext
) => Promise<void>;

const onFollowUser: OnFollowUser = async (
  followedUserId,
  performerId,
  context
) => {
  const news = {
    type: NEW_FOLLOWER,
    performerId,
    followedUserId
  };

  await context.models.newsfeed.create(news);
};

type OnNewComment = (
  answer: DbTypes.Answer,
  commentId: string,
  performerId: string,
  context: ApolloContext
) => Promise<void>;

const onNewComment: OnNewComment = async (
  answer,
  commentId,
  performerId,
  context
) => {
  const news = {
    type: NEW_COMMENT,
    performerId,
    answerOwnerId: answer.userId.toString(),
    answerId: answer._id.toString(),
    commentId
  };

  await context.models.newsfeed.create(news);
};

type OnAnswerChange = (
  type: DbTypes.NewsType.NewAnswer | DbTypes.NewsType.NewAnswerEdition,
  answerId: string,
  performerId: string,
  context: ApolloContext
) => Promise<void>;

const onAnswerChange: OnAnswerChange = async (
  type,
  answerId,
  performerId,
  context
) => {
  const news: DbTypes.AnswerNews = {
    _id: ObjectId(),
    type,
    performerId,
    answerOwnerId: performerId, // double check if that is true
    answerId
  };

  await context.models.newsfeed.create(news);
};

type OnNewAnswer = (
  answerId: string,
  performerId: string,
  context: ApolloContext
) => Promise<void>;

const onNewAnswer: OnNewAnswer = async (answerId, performerId, context) => {
  await onAnswerChange(
    DbTypes.NewsType.NewAnswer,
    answerId,
    performerId,
    context
  );
};

type OnEditAnswer = (
  answerId: string,
  performerId: string,
  context: ApolloContext
) => Promise<void>;

const onEditAnswer: OnEditAnswer = async (answerId, performerId, context) => {
  await onAnswerChange(
    DbTypes.NewsType.NewAnswerEdition,
    answerId,
    performerId,
    context
  );
};

type GetAnswerIdFromNews = (news: DbTypes.News) => string | null;

const getAnswerIdFromNews: GetAnswerIdFromNews = news => {
  if (news.type === DbTypes.NewsType.NewFollower) return null;
  return news.answerId;
};

type GetNewsfeedQuestions = (
  newsfeed: DbTypes.Newsfeed,
  context: ApolloContext
) => Promise<DbTypes.AnsweredQuestion[] | null>;

const getNewsFeedQuestions: GetNewsfeedQuestions = async (
  newsfeed,
  { models }
) => {
  const answerIds: string[] = [];
  newsfeed.forEach(news => {
    const answerId = getAnswerIdFromNews(news);
    if (answerId && !answerIds.includes(answerId)) {
      answerIds.push(answerId);
    }
  });

  if (!answerIds) return null;

  const answers = (await models.answer.find({ _id: { $in: answerIds } })).map(
    answerDoc => answerDoc.toObject()
  );

  if (!answers.length) {
    throw Error(`couldn't find answers in the database`);
  }

  const questionsIds = answers.map(a => a.questionId);
  const questions = (await models.question.find({
    _id: { $in: questionsIds }
  })).map(questionDoc => questionDoc.toObject());

  if (!questions.length) {
    throw Error(`couldn't find questions in the database`);
  }

  const answeredQuestions: DbTypes.AnsweredQuestion[] = answers.map(a => {
    const question = questions.find(q => q._id.equals(a.questionId));
    return { ...question!, answer: a };
  });

  return answeredQuestions;
};

type GetUsersFromNews = (news: DbTypes.News) => string[];

const getUsersFromNews: GetUsersFromNews = news => {
  if (news.type === DbTypes.NewsType.NewFollower) {
    return [news.performerId, news.followedUserId];
    /* 
     double check if we need followedUserId
      */
  }

  return [news.performerId, news.answerOwnerId];
};

type GetNewsfeedUsers = (
  newsfeed: DbTypes.Newsfeed,
  context: ApolloContext
) => Promise<DbTypes.User[]>;
const getNewsFeedUsers: GetNewsfeedUsers = async (newsfeed, { models }) => {
  const newsfeedUsersIds: string[] = [];

  newsfeed.forEach(news => {
    const newsUsers = getUsersFromNews(news);
    newsUsers.forEach(userId => {
      if (!newsfeedUsersIds.includes(userId)) {
        newsfeedUsersIds.push(userId);
      }
    });
  });

  const newsfeedUsers = (await models.user.find({
    _id: { $in: newsfeedUsersIds }
  })).map(userDoc => userDoc.toObject());

  return newsfeedUsers;
};

type GetNewsfeed = (context: ApolloContext) => Promise<DbTypes.Newsfeed>;

const getNewsfeed: GetNewsfeed = async context => {
  const { models, user } = context;
  const { following } = (await models.user.findById(user!.id))!.toObject();
  const followingIds: string[] = [];

  if (following) {
    following.forEach(userr => {
      followingIds.push(userr.toHexString());
    });
  }

  const newsfeed = (await models.newsfeed
    .find({
      performerId: { $in: followingIds }
    })
    .lean()) as DbTypes.Newsfeed;

  return newsfeed.reverse(); // newest first
};

export const newsfeedService = {
  onNewAnswer,
  onEditAnswer,
  onNewComment,
  onLikeAnswer,
  onFollowUser,
  getNewsfeed,
  getNewsFeedQuestions,
  getNewsFeedUsers
};
