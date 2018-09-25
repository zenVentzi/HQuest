const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const { mapGqlAnswer } = require('../resolvers/helper');

const getUserAnswers = async ({ userId }, context) => {
  const {
    models: { Answer },
  } = context;

  return Answer.find({ userId: ObjectId(userId) }).lean();
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

  const answer = {
    userId: ObjectId(context.user.id),
    questionId: ObjectId(questionId),
    comments: [],
    value: answerValue,
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

module.exports = { add, edit, remove, getUserAnswers };
