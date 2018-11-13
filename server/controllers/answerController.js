const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const { QuestionTypes } = require('../constants');
const { mapGqlAnswer } = require('../resolvers/helper');

const getUserAnswers = async ({ userId }, context) => {
  const {
    models: { Answer },
  } = context;

  const res = await Answer.find({
    userId: ObjectId(userId),
    $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
  })
    .sort({ position: 1 })
    .lean();

  return res;
};

const createEdition = async ({ answerId, answerValue }, context) => {
  const {
    models: { Answer, Question },
  } = context;

  const oldAnswer = await Answer.findById(answerId).lean();
  const { type: questionType, possibleAnswers } = await Question.findById(
    oldAnswer.questionId
  ).lean();

  let before;
  let after;

  if (questionType === QuestionTypes.SCALE) {
    const oldAnswerName = possibleAnswers[oldAnswer.value];
    const updatedAnswerName = possibleAnswers[answerValue];
    before = oldAnswerName;
    after = updatedAnswerName;
  } else {
    before = oldAnswer.value;
    after = answerValue;
  }

  return {
    id: ObjectId(),
    date: new Date().toISOString(),
    before,
    after,
  };
};

const edit = async ({ answerId, answerValue }, context) => {
  const {
    models: { Answer },
    user,
  } = context;

  const edition = await createEdition({ answerId, answerValue }, context);

  const updatedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { value: answerValue },
      $push: { editions: edition },
    },
    { new: true, upsert: true }
  ).lean();

  return mapGqlAnswer({ answer: updatedAnswer, loggedUserId: user.id });
};

const add = async ({ questionId, answerValue }, context) => {
  const {
    models: { Answer },
    user,
  } = context;

  await Answer.updateMany({}, { $inc: { position: 1 } });
  let result;

  const deletedAnswer = await Answer.findOne({
    questionId: ObjectId(questionId),
    userId: ObjectId(user.id),
  }).lean();

  if (deletedAnswer) {
    await edit(
      { answerId: deletedAnswer._id.toString(), answerValue },
      context
    );
    result = await Answer.findByIdAndUpdate(deletedAnswer._id, {
      $set: { isDeleted: false, position: 1 },
    }).lean();
  } else {
    const newAnswer = {
      userId: ObjectId(user.id),
      questionId: ObjectId(questionId),
      comments: [],
      value: answerValue,
      position: 1,
    };

    result = await Answer.create(newAnswer);
  }

  return mapGqlAnswer({ answer: result, loggedUserId: user.id });
};

const remove = async ({ answerId }, context) => {
  const {
    models: { Answer },
    user,
  } = context;

  const deletedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { isDeleted: true },
    },
    { new: true, upsert: true }
  ).lean();

  await Answer.updateMany(
    { position: { gt: deletedAnswer.position } },
    { $inc: { position: -1 } }
  );

  return mapGqlAnswer({ answer: deletedAnswer, loggedUserId: user.id });
};

const like = async ({ answerId, numOfLikes }, context) => {
  const {
    models: { Answer, User },
    user,
  } = context;
  /* 

  likes: { total: 27, likers: [{ id: ObjectID(`user`), numOfLikes: 5, .. }]}
*/

  const { likes } = await Answer.findById(answerId).lean();
  const dbUserLiker = await User.findById(user.id).lean();
  let updatedLikes = { total: 0, likers: [] };

  if (!likes) {
    updatedLikes = {
      total: numOfLikes,
      likers: [{ user: dbUserLiker, numOfLikes }],
    };
  } else {
    updatedLikes.likers = likes.likers.filter(
      liker => !liker.user._id.equals(dbUserLiker._id)
    );

    updatedLikes.likers.push({ user: dbUserLiker, numOfLikes });
    updatedLikes.total = updatedLikes.likers.reduce((total, liker) => {
      const res = total + liker.numOfLikes;
      return res;
    }, 0);
  }

  const likedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { likes: updatedLikes },
    },
    { new: true, upsert: true }
  ).lean();

  return mapGqlAnswer({ answer: likedAnswer, loggedUserId: user.id });
};

const movePosition = async ({ answerId, position }, context) => {
  const {
    models: { Answer },
  } = context;

  const answersCount = await Answer.count();
  // const reversedPosition = answersCount - position + 1;
  const currentAnswer = await Answer.findById(answerId).lean();
  await Answer.findOneAndUpdate(
    { position },
    { $set: { position: currentAnswer.position } }
  );

  await Answer.findByIdAndUpdate(answerId, {
    $set: { position },
  });

  return position;
};

module.exports = { add, edit, remove, like, movePosition, getUserAnswers };
