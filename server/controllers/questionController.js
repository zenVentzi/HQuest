const { ObjectId } = require('mongoose').Types;
const { mapGqlQuestions } = require('../resolvers/helper');

const createQuestion = async ({ question, type, possibleAnswers }, context) => {
  const {
    models: { Question },
  } = context;

  await Question.create({
    question,
    type,
    possibleAnswers,
  });
};

const pairAnswerToQuestion = (answers, questions) => {
  const pairs = answers.map(answer => {
    const question = questions.find(q => q._id.equals(answer.questionId));
    return { ...question, answer };
  });

  return pairs;
};

const getUserQuestions = async (userId, context) => {
  const {
    models: { Answer, Question, User },
  } = context;

  const result = {
    answeredQuestions: [],
    unansweredQuestions: [],
  };

  const answers = await Answer.find({ userId: ObjectId(userId) }).lean();

  let answeredQuestionsIds = [];

  if (answers.length > 0) {
    answeredQuestionsIds = answers.map(a => a.questionId);
    const answeredQuestionsOnly = await Question.find({
      _id: { $in: answeredQuestionsIds },
    }).lean();
    result.answeredQuestions = pairAnswerToQuestion(
      answers,
      answeredQuestionsOnly
    );
  }

  result.unansweredQuestions = await Question.find({
    _id: {
      $nin: answeredQuestionsIds,
    },
  }).lean();

  return result;
};

const getAnsweredQuestions = async (userId, context) => {
  const { answeredQuestions } = await getUserQuestions(userId, context);
  return mapGqlQuestions(answeredQuestions);
};

const getUnansweredQuestions = async (userId, context) => {
  const { unansweredQuestions } = await getUserQuestions(userId, context);
  return mapGqlQuestions(unansweredQuestions);
};

module.exports = {
  createQuestion,
  getAnsweredQuestions,
  getUnansweredQuestions,
};
