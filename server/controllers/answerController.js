const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
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

const edit = async ({ answerId, answerValue }, context) => {
  const {
    models: { Answer },
  } = context;

  const oldAnswer = await Answer.findById(answerId).lean();

  const edition = {
    id: ObjectId(),
    date: new Date().toISOString(),
    before: oldAnswer.value,
    after: answerValue,
  };

  const newAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { value: answerValue },
      $push: { editions: edition },
    },
    { new: true, upsert: true }
  ).lean();

  return mapGqlAnswer(newAnswer);
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

  return mapGqlAnswer(result);
};

const remove = async ({ answerId }, context) => {
  const {
    models: { Answer },
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

  return mapGqlAnswer(deletedAnswer);
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

module.exports = { add, edit, remove, movePosition, getUserAnswers };
