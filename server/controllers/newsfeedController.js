const { ObjectId } = require('mongoose').Types;
// const {} = require('../resolvers/helper');

const NEW_ANSWER = 'NEW_ANSWER';
const NEW_ANSWER_EDITION = 'NEW_ANSWER_EDITION';
const NEW_COMMENT = 'NEW_COMMENT';
const NEW_FOLLOWER = 'NEW_FOLLOWER';
const NEW_LIKE = 'NEW_LIKE';

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
  getNewsfeed,
};
