const { ObjectId } = require('mongoose').Types;
// not using index.js bcuz it causes cycle dependencies
const answerController = require('./answerController');
const questionController = require('./questionController');
const userController = require('./userController');
const { mapGqlUsers, mapGqlNewsFeed } = require('../resolvers/helper');

const NEW_ANSWER = 'NEW_ANSWER';
const NEW_ANSWER_EDITION = 'NEW_ANSWER_EDITION';
const NEW_COMMENT = 'NEW_COMMENT';
const NEW_FOLLOWER = 'NEW_FOLLOWER';
const NEW_LIKE = 'NEW_LIKE';

const checkIfAnswerLikedBefore = async ({ news, context }) => {
  const {
    models: { Newsfeed },
  } = context;

  const existingNews = await Newsfeed.findOne({
    type: news.type,
    performerId: news.performerId,
    answerId: news.answerId,
  }).lean();

  return !!existingNews;
};

const onLikeAnswer = async ({ answerId, context }) => {
  const {
    models: { Newsfeed },
    user,
  } = context;

  const answer = await answerController.getAnswerById({ answerId, context });

  const news = {
    type: NEW_LIKE,
    performerId: user.id,
    answerOwnerId: answer.userId.toString(),
    answerId,
  };

  if (!(await checkIfAnswerLikedBefore({ news, context }))) {
    await Newsfeed.create(news);
  }
};

const onFollowUser = async ({ followedUserId, context }) => {
  const {
    models: { Newsfeed },
    user,
  } = context;

  const news = {
    type: NEW_FOLLOWER,
    performerId: user.id,
    followedUserId,
  };

  await Newsfeed.create(news);
};

const onNewComment = async ({ answerId, commentId, context }) => {
  const {
    models: { Newsfeed },
    user,
  } = context;

  const answer = await answerController.getAnswerById({ answerId, context });

  const news = {
    type: NEW_COMMENT,
    performerId: user.id,
    answerOwnerId: answer.userId.toString(),
    answerId,
    commentId,
  };

  await Newsfeed.create(news);
};

const onAnswerChange = async ({ type, answer, context }) => {
  const {
    models: { Newsfeed },
    user,
  } = context;

  const news = {
    type,
    performerId: user.id,
    answerId: answer._id.toString(),
  };

  await Newsfeed.create(news);
};

const onNewAnswer = async ({ answer, context }) => {
  await onAnswerChange({
    type: NEW_ANSWER,
    answer,
    context,
  });
};

const onEditAnswer = async ({ answer, context }) => {
  await onAnswerChange({
    type: NEW_ANSWER_EDITION,
    answer,
    context,
  });
};

const getNewsFeedUsers = async ({ newsFeed, context }) => {
  const neewsFeedUserIds = [];

  newsFeed.forEach(news => {
    if (!neewsFeedUserIds.includes(news.performerId)) {
      neewsFeedUserIds.push(news.performerId);
    }
    if (!neewsFeedUserIds.includes(news.answerOwnerId)) {
      neewsFeedUserIds.push(news.answerOwnerId);
    }
  });

  const newsFeedUsers = await userController.getUsersWithIds({
    ids: neewsFeedUserIds,
    context,
  });
  return newsFeedUsers;
};

const getNewsfeed = async ({ context }) => {
  const {
    models: { Newsfeed, User },
    user,
  } = context;

  const { following } = await User.findById(user.id).lean();
  const followingIds = [];

  if (following) {
    following.forEach(userr => {
      followingIds.push(userr._id.toString());
    });
  }

  const newsFeed = await Newsfeed.find({
    performerId: { $in: followingIds },
  }).lean();

  const newsFeedUsers = await getNewsFeedUsers({
    newsFeed,
    context,
  });

  const newsFeedQuestions = await questionController.getNewsFeedQuestions({
    newsFeed,
    context,
  });

  const gqlNewsfeed = mapGqlNewsFeed({
    newsFeed,
    newsFeedUsers,
    newsFeedQuestions,
  });
  return gqlNewsfeed.reverse();
};

module.exports = {
  onNewAnswer,
  onEditAnswer,
  onNewComment,
  onLikeAnswer,
  onFollowUser,
  getNewsfeed,
};
