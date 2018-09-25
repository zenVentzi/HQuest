const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const { mapGqlAnswer } = require('../resolvers/helper');

const getUserAnswers = async ({ userId }, context) => {
  const {
    models: { Answer },
  } = context;

  const res = await Answer.find({ userId: ObjectId(userId) })
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
  } = context;

  const numOfAnswers = await Answer.count();

  const answer = {
    userId: ObjectId(context.user.id),
    questionId: ObjectId(questionId),
    comments: [],
    value: answerValue,
    position: numOfAnswers + 1,
  };

  const newAnswer = await Answer.create(answer);

  return mapGqlAnswer(newAnswer);
};

const remove = async ({ answerId }, context) => {
  const {
    models: { Answer },
  } = context;

  const deletedAnswer = await Answer.findByIdAndDelete(answerId).lean();

  return mapGqlAnswer(deletedAnswer);
};

const movePosition = async ({ answerId, position }, context) => {
  const {
    models: { Answer },
  } = context;

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
