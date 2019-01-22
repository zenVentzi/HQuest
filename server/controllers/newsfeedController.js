const { ObjectId } = require('mongoose').Types;

const NEW_ANSWER = 'NEW_ANSWER';
const NEW_ANSWER_EDITION = 'NEW_ANSWER_EDITION';
const NEW_COMMENT = 'NEW_COMMENT';
const NEW_FOLLOWER = 'NEW_FOLLOWER';
const NEW_LIKE = 'NEW_LIKE';

const checkLikedBefore = Newsfeed => async ({ news }) => {
  const existingNews = await Newsfeed.findOne({
    type: news.type,
    performerId: news.performerId,
    answerId: news.answerId,
  }).lean();

  return !!existingNews;
};

const onLikeAnswer = Newsfeed => async ({ dbAnswer, performerId }) => {
  const news = {
    type: NEW_LIKE,
    performerId,
    answerOwnerId: dbAnswer.userId.toString(),
    answerId: dbAnswer._id.toString(),
  };

  if (!(await checkLikedBefore(Newsfeed)({ news }))) {
    await Newsfeed.create(news);
  }
};

const onFollowUser = Newsfeed => async ({
  followedUserId,
  performedId: performerId,
}) => {
  const news = {
    type: NEW_FOLLOWER,
    performerId,
    followedUserId,
  };

  await Newsfeed.create(news);
};

const onNewComment = Newsfeed => async ({
  dbAnswer,
  commentId,
  performerId,
}) => {
  const news = {
    type: NEW_COMMENT,
    performerId,
    answerOwnerId: dbAnswer.userId.toString(),
    answerId: dbAnswer._id.toString(),
    commentId,
  };

  await Newsfeed.create(news);
};

const onAnswerChange = Newsfeed => async ({ type, answerId, performerId }) => {
  const news = {
    type,
    performerId,
    answerId,
  };

  await Newsfeed.create(news);
};

const onNewAnswer = Newsfeed => async ({ answerId, performerId }) => {
  await onAnswerChange(Newsfeed)({
    type: NEW_ANSWER,
    answerId,
    performerId,
  });
};

const onEditAnswer = Newsfeed => async ({ answerId, performerId }) => {
  await onAnswerChange(Newsfeed)({
    type: NEW_ANSWER_EDITION,
    answerId,
    performerId,
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
    performerId: { $in: usersIds },
  }).lean();
};

export default Newsfeed => {
  return {
    onNewAnswer,
    onEditAnswer,
    onNewComment,
    onLikeAnswer,
    onFollowUser,
    getUsersActivity,
    getParticipantsIds,
  };
};
