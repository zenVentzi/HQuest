const { ObjectId } = require('mongoose').Types;
const { mapGqlQuestions, mapGqlQuestion } = require('../resolvers/helper');

const createQuestion = async (
  { question, type, possibleAnswers, tags },
  context
) => {
  const {
    models: { Question },
  } = context;

  /* store the tags in separate collection? */

  await Question.create({
    question,
    type,
    possibleAnswers,
    tags,
  });
};

const getAllTags = async context => {
  const {
    models: { Question },
  } = context;

  const questions = await Question.find().lean();
  const reducer = (tags, currentQuestion) => {
    const questionTags = currentQuestion.tags.filter(t => !tags.includes(t));

    return [...tags, ...questionTags];
  };

  const tags = questions.reduce(reducer, []);
  return tags;
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

const getUserQuestions = async (userId, tags, context) => {
  const {
    models: { Answer, Question },
  } = context;

  const result = {
    answeredQuestions: [],
    unansweredQuestions: [],
  };

  const answers = await Answer.find({ userId: ObjectId(userId) }).lean();

  let answeredQuestionsIds = [];

  if (answers.length > 0) {
    answeredQuestionsIds = answers.map(a => a.questionId);
    const query = {
      _id: { $in: answeredQuestionsIds },
      tags: { $in: tags },
    };

    if (!tags.length) {
      delete query.tags;
    }
    const answeredQuestionsOnly = await Question.find(query).lean();
    result.answeredQuestions = pairAnswersToQuestions(
      answers,
      answeredQuestionsOnly
    );
  }

  const query = {
    _id: {
      $nin: answeredQuestionsIds,
    },
    tags: { $in: tags },
  };
  if (!tags.length) {
    delete query.tags;
  }

  result.unansweredQuestions = await Question.find(query).lean();

  return result;
};

const getAnsweredQuestions = async (userId, tags, context) => {
  const { answeredQuestions } = await getUserQuestions(userId, tags, context);
  return mapGqlQuestions(answeredQuestions);
};

const getUnansweredQuestions = async (userId, tags, context) => {
  const { unansweredQuestions } = await getUserQuestions(userId, tags, context);
  return mapGqlQuestions(unansweredQuestions);
};

module.exports = {
  createQuestion,
  getAllTags,
  getAnsweredQuestion,
  getAnsweredQuestions,
  getUnansweredQuestions,
};
