import { ApolloContext } from "gqlContext";
import * as DbTypes from "../dbTypes";

const { ObjectId } = require("mongoose").Types;

const NEW_ANSWER = "NEW_ANSWER";
const NEW_ANSWER_EDITION = "NEW_ANSWER_EDITION";
const NEW_COMMENT = "NEW_COMMENT";
const NEW_FOLLOWER = "NEW_FOLLOWER";
const NEW_LIKE = "NEW_LIKE";

const checkLikedBefore = Newsfeed => async ({ news }) => {
  const existingNews = await Newsfeed.findOne({
    type: news.type,
    performerId: news.performerId,
    answerId: news.answerId
  }).lean();

  return !!existingNews;
};

const onLikeAnswer = Newsfeed => async ({ dbAnswer, performerId }) => {
  const news = {
    type: NEW_LIKE,
    performerId,
    answerOwnerId: dbAnswer.userId.toString(),
    answerId: dbAnswer._id.toString()
  };

  if (!(await checkLikedBefore(Newsfeed)({ news }))) {
    await Newsfeed.create(news);
  }
};

const onFollowUser = Newsfeed => async ({
  followedUserId,
  performedId: performerId
}) => {
  const news = {
    type: NEW_FOLLOWER,
    performerId,
    followedUserId
  };

  await Newsfeed.create(news);
};

const onNewComment = Newsfeed => async ({
  dbAnswer,
  commentId,
  performerId
}) => {
  const news = {
    type: NEW_COMMENT,
    performerId,
    answerOwnerId: dbAnswer.userId.toString(),
    answerId: dbAnswer._id.toString(),
    commentId
  };

  await Newsfeed.create(news);
};

const onAnswerChange = Newsfeed => async ({ type, answerId, performerId }) => {
  const news = {
    type,
    performerId,
    answerId
  };

  await Newsfeed.create(news);
};

const onNewAnswer = Newsfeed => async ({ answerId, performerId }) => {
  await onAnswerChange(Newsfeed)({
    type: NEW_ANSWER,
    answerId,
    performerId
  });
};

const onEditAnswer = Newsfeed => async ({ answerId, performerId }) => {
  await onAnswerChange(Newsfeed)({
    type: NEW_ANSWER_EDITION,
    answerId,
    performerId
  });
};

const getUsersActivity = Newsfeed => async ({ usersIds }) => {
  return Newsfeed.find({
    performerId: { $in: usersIds }
  }).lean();
};

type GetAnswerIdFromNews = (news: DbTypes.News) => string | null;

const getAnswerIdFromNews: GetAnswerIdFromNews = news => {
  if (news.type === DbTypes.NewsType.NewFollower) return null;
  return news.answerId;
};

type GetNewsfeedQuestions = (
  newsfeed: DbTypes.Newsfeed,
  context: ApolloContext
) => Promise<DbTypes.AnsweredQuestion[]>;

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

  const answers = (await models.answer.find({ _id: { $in: answerIds } })).map(
    answerDoc => answerDoc.toObject()
  );

  const questionsIds = answers.map(a => a.questionId);
  const unansweredQs = (await models.question.find({
    _id: { $in: questionsIds }
  })).map(questionDoc => questionDoc.toObject());

  const answeredQuestions = answers.map(a => {
    const question = unansweredQs.find(q => q._id.equals(a.questionId));
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
  getUsersActivity,
  getNewsfeed,
  getNewsFeedQuestions,
  getNewsFeedUsers
};
