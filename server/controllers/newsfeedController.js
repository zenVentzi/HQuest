const { ObjectId } = require('mongoose').Types;
// not using index.js bcuz newsfeecController causes cycle dependencies
const answerController = require('./answerController');
const questionController = require('./questionController');
const userController = require('./userController');
const { mapGqlUsers, mapGqlQuestions } = require('../resolvers/helper');

const NEW_ANSWER = 'NEW_ANSWER';
const NEW_ANSWER_EDITION = 'NEW_ANSWER_EDITION';
const NEW_COMMENT = 'NEW_COMMENT';
const NEW_FOLLOWER = 'NEW_FOLLOWER';
const NEW_LIKE = 'NEW_LIKE';

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
    questionId: answer.questionId.toString(),
    commentId,
  };

  await Newsfeed.create(news);
};

const onAnswerChange = async ({ type, answeredQuestion, context }) => {
  const {
    models: { Newsfeed },
    user,
  } = context;

  const news = {
    type,
    performerId: user.id,
    question: answeredQuestion,
  };

  await Newsfeed.create(news);
};
const onNewAnswer = async ({ answeredQuestion, performer, context }) => {
  await onAnswerChange({
    type: NEW_ANSWER,
    answeredQuestion,
    performer,
    context,
  });
};

const onEditAnswer = async ({ answeredQuestion, performer, context }) => {
  await onAnswerChange({
    type: NEW_ANSWER_EDITION,
    answeredQuestion,
    performer,
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

  return mapGqlUsers({ users: newsFeedUsers, loggedUserId: context.user.id });
};

const getNewsFeedQuestions = async ({ newsFeed, context }) => {
  const questions = await questionController.getNewsFeedQuestions({
    newsFeed,
    context,
  });
  return mapGqlQuestions({ questions, loggedUserId: context.user.id });
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

  const dbNewsFeed = await Newsfeed.find({
    performerId: { $in: followingIds },
  }).lean();

  const newsfeedUsers = await getNewsFeedUsers({
    newsFeed: dbNewsFeed,
    context,
  });

  const newsFeedQuestions = await getNewsFeedQuestions({
    newsFeed: dbNewsFeed,
    context,
  });

  // this to be extracted to the mapper file(resolvers/helper)
  const gqlNewsfeed = dbNewsFeed.map(news => {
    const gqlNews = { ...news };
    gqlNews.createdOn = news._id.getTimestamp();
    gqlNews.performer = newsfeedUsers.find(usr => news.performerId === usr.id);
    const newsQuestion = newsFeedQuestions.find(q => news.questionId === q.id);

    if (newsQuestion) {
      gqlNews.question = newsQuestion;
      gqlNews.answerOwner = newsfeedUsers.find(
        usr => news.answerOwnerId === usr.id
      );
      delete gqlNews.answerOwnerId;
      delete gqlNews.questionId;
    }

    delete gqlNews._id;
    delete gqlNews.answerId;
    delete gqlNews.performerId;
    return gqlNews;
  });
  return gqlNewsfeed;
};

module.exports = {
  onNewAnswer,
  onEditAnswer,
  onNewComment,
  getNewsfeed,
};
