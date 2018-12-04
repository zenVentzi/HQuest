const { ObjectId } = require('mongoose').Types;
// not using index.js bcuz newsfeecController causes cycle dependencies
const answerController = require('./answerController');
const questionController = require('./questionController');
const userController = require('./userController');

const NEW_ANSWER = 'NEW_ANSWER';
const NEW_ANSWER_EDITION = 'NEW_ANSWER_EDITION';
const NEW_COMMENT = 'NEW_COMMENT';
const NEW_FOLLOWER = 'NEW_FOLLOWER';
const NEW_LIKE = 'NEW_LIKE';

const onNewComment = async ({ answerId, commentId, context }) => {
  const {
    models: { Newsfeed },
  } = context;

  const answer = await answerController.getAnswerById({ answerId, context });

  const answerOwner = await userController.getUser(answer.userId, context);

  const answeredQuestion = await questionController.getAnsweredQuestion(
    answer.userId,
    answer.questionId,
    context
  );

  const performer = await userController.getUser(context.user.id, context);

  const performerCopy = { ...performer };
  delete performerCopy.me;

  const news = {
    type: NEW_COMMENT,
    performer: performerCopy,
    answerOwner,
    question: answeredQuestion,
    commentId,
  };

  await Newsfeed.create(news);
};

const onAnswerChange = async ({
  type,
  answeredQuestion,
  performer,
  context,
}) => {
  const {
    models: { Newsfeed },
  } = context;

  const copy = { ...performer };
  delete copy.me;

  const news = {
    type,
    performer: copy,
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
    'performer.id': { $in: followingIds },
  }).lean();

  const res = newsFeed.map(news => {
    const edited = { ...news };
    edited.createdOn = news._id.getTimestamp();
    delete edited._id;
    edited.performer.me = false;
    return edited;
  });
  return res;
};

module.exports = {
  onNewAnswer,
  onEditAnswer,
  onNewComment,
  getNewsfeed,
};
