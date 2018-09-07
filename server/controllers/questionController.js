const { ObjectId } = require('mongoose').Types;
const { mapGqlQuestions, mapGqlQuestion } = require('../resolvers/helper');

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

const pairAnswerToQuestion = (answer, question) => {
  return { ...question, answer };
};

const pairAnswersToQuestions = (answers, questions) => {
  const pairs = answers.map(answer => {
    const question = questions.find(q => q._id.equals(answer.questionId));
    return pairAnswerToQuestion(answer, question);
  });

  return pairs;
};

const getAnsweredQuestion = async (userId, questionId, context) => {
  const {
    models: { Answer, Question },
  } = context;

  const answerQuery = {
    userId: ObjectId(userId),
    questionId: ObjectId(questionId),
  };

  const answer = await Answer.findOne(answerQuery).lean();
  const question = await Question.findById(questionId).lean();
  const answeredQuestion = pairAnswerToQuestion(answer, question);
  return mapGqlQuestion(answeredQuestion);
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
    result.answeredQuestions = pairAnswersToQuestions(
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
  getAnsweredQuestion,
  getAnsweredQuestions,
  getUnansweredQuestions,
};
