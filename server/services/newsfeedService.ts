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

const getParticipantsIds = ({ newsfeed }) => {
  const participantsIds = [];
  const isAdded = id => participantsIds.includes(id);

  // todo imrprove readability
  newsfeed.forEach(news => {
    if (!isAdded(news.performerId)) {
      participantsIds.push(news.performerId);
    }
    if (!isAdded(news.answerOwnerId)) {
      participantsIds.push(news.answerOwnerId);
    }
  });

  return participantsIds;
};

const getUsersActivity = Newsfeed => async ({ usersIds }) => {
  return Newsfeed.find({
    performerId: { $in: usersIds }
  }).lean();
};

type GetNewsfeedQuestions = (
  newsfeed: DbTypes.Newsfeed,
  context: ApolloContext
) => Promise<DbTypes.Question>;

const getNewsFeedQuestions: GetNewsfeedQuestions = async (
  newsfeed,
  { models }
) => {
  const answerIds: string[] = [];
  newsfeed.forEach(news => {
    if (news.answerId) {
      answerIds.push(news.answerId);
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
    return { ...question, answer: a };
  });

  const newsFeedQuestions = await getAnsweredQuestions(
    { answers, questionsIds },
    context
  );

  return newsFeedQuestions;
};

type GetNewsfeedUsers = (
  newsfeed: DbTypes.Newsfeed,
  context: ApolloContext
) => Promise<DbTypes.User[]>;
const getNewsFeedUsers: GetNewsfeedUsers = async (newsfeed, { models }) => {
  const newsfeedUsersIds: string[] = [];

  newsfeed.forEach(news => {
    if (!newsfeedUsersIds.includes(news.performerId)) {
      newsfeedUsersIds.push(news.performerId);
    }
    if (!newsfeedUsersIds.includes(news.answerOwnerId)) {
      newsfeedUsersIds.push(news.answerOwnerId);
    }
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

  const newsFeedUsers = await getNewsFeedUsers(newsfeed, context);

  const newsFeedQuestions = await getNewsFeedQuestions(newsfeed, context);

  const gqlNewsfeed = mapGqlNewsFeed({
    newsFeed,
    newsFeedUsers,
    newsFeedQuestions
  });
  return gqlNewsfeed.reverse();
};

export const newsfeedService = {
  onNewAnswer,
  onEditAnswer,
  onNewComment,
  onLikeAnswer,
  onFollowUser,
  getUsersActivity,
  getParticipantsIds
};
