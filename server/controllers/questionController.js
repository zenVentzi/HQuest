const { ObjectId } = require('mongoose').Types;
const answerController = require('./answerController');
const { mapGqlQuestions, mapGqlQuestion } = require('../resolvers/helper');

const createQuestion = async (
  { question, type, defaultAnswer, possibleAnswers, tags },
  context
) => {
  const {
    models: { Question },
  } = context;

  /* store the tags in separate collection? */

  await Question.create({
    question,
    type,
    defaultAnswer,
    possibleAnswers,
    tags,
  });
};

const markNotApply = async ({ questionId }, context) => {
  const {
    models: { User, Question },
    user,
  } = context;

  /* 1) store questionsNotApply list in user doc */

  await User.findByIdAndUpdate(
    user.id,
    { $push: { questionsNotApply: ObjectId(questionId) } },
    { new: true, upsert: true }
  );

  const question = await Question.findById(questionId).lean();
  return mapGqlQuestion({ question, loggedUserId: user.id });
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

const mergeAnswerWithQuestion = (answer, question) => {
  return { ...question, answer };
};

const mergeAnswersWithQuestions = (allUserAnswers, paginatedQuestions) => {
  const result = [];

  paginatedQuestions.forEach(question => {
    const answer = allUserAnswers.find(a => a.questionId.equals(question._id));
    const merged = mergeAnswerWithQuestion(answer, question);
    result.push(merged);
  });

  return result;
};

const getAnsweredQuestion = async (userId, questionId, context) => {
  const {
    models: { Answer, Question },
    user,
  } = context;

  const answer = await answerController.getUserAnswer({
    userId,
    questionId,
    context,
  });
  const question = await Question.findById(questionId).lean();
  const answeredQuestion = mergeAnswerWithQuestion(answer, question);
  return mapGqlQuestion({ question: answeredQuestion, loggedUserId: user.id });
};

const preserveOrder = ({ answeredQuestionsIds, questions }) => {
  const res = answeredQuestionsIds
    .map(id => questions.find(q => q._id.equals(id)))
    .filter(q => q); // filters undefined or null values
  return res;
};

const getUserAnsweredQuestions = async (
  { answers, answeredQuestionsIds, tags },
  context
) => {
  const {
    models: { Question, User },
    user,
  } = context;

  const query = { _id: { $in: answeredQuestionsIds } };

  if (tags.length) {
    query.tags = { $in: tags };
  }

  const questions = await Question.find(query).lean();
  // this is done because the $in query returns in different order
  const orderedQs = preserveOrder({ answeredQuestionsIds, questions });
  const mergedQuestions = mergeAnswersWithQuestions(answers, orderedQs);
  return mapGqlQuestions({
    questions: mergedQuestions,
    loggedUserId: user.id,
  });
};

const getUserUnansweredQuestions = async (
  { answeredQuestionsIds, tags },
  context
) => {
  const {
    models: { User, Question },
    user,
  } = context;

  const { questionsNotApply: questionsNotApplyIds } = await User.findById(
    user.id
  ).lean();

  const notInArray = answeredQuestionsIds.concat(questionsNotApplyIds);

  const query = {
    _id: { $nin: notInArray },
  };

  if (tags.length) {
    query.tags = { $in: tags };
  }

  const questions = await Question.find(query).lean();

  return mapGqlQuestions({ questions, loggedUserId: user.id });
};

const getAnsweredQuestionsIds = answers => answers.map(a => a.questionId);

const getAllEdges = nodes => {
  return nodes.map(node => {
    const cursor = node.id;
    return {
      cursor,
      node,
    };
  });
};
const getCurrentPageEdges = ({ first, after }, allEdges) => {
  let startIndex = 0;

  if (after) {
    startIndex = allEdges.findIndex(e => e.cursor === after) + 1;
  }

  const endIndex = startIndex + first;
  const res = allEdges.slice(startIndex, endIndex);
  return res;
};

const getPageInfo = (allEdges, currentPageEdges) => {
  let startCursor;
  let endCursor;
  let hasPreviousPage = false;
  let hasNextPage = false;

  if (!allEdges.length) {
    hasPreviousPage = false;
    hasNextPage = false;
  } else if (!currentPageEdges.length) {
    hasPreviousPage = true;
    hasNextPage = false;
  } else {
    startCursor = currentPageEdges[0].cursor;
    endCursor = currentPageEdges[currentPageEdges.length - 1].cursor;
    const beforeStartCursor = edge =>
      ObjectId(edge.cursor) < ObjectId(startCursor);
    const afterEndCursor = edge => ObjectId(edge.cursor) > ObjectId(endCursor);

    hasPreviousPage = allEdges.filter(beforeStartCursor).length > 0;
    hasNextPage = allEdges.filter(afterEndCursor).length > 0;
  }

  return {
    startCursor,
    endCursor,
    hasPreviousPage,
    hasNextPage,
  };
};

const getUserQuestionConnection = async (args, context) => {
  const answeredQuestionsIds = await getAnsweredQuestionsIds(args.answers);
  let questions;

  if (args.answered) {
    questions = await getUserAnsweredQuestions(
      { ...args, answeredQuestionsIds },
      context
    );
  } else {
    questions = await getUserUnansweredQuestions(
      { ...args, answeredQuestionsIds },
      context
    );
  }

  const allEdges = getAllEdges(questions);
  const currentPageEdges = getCurrentPageEdges(args, allEdges);
  const pageInfo = getPageInfo(allEdges, currentPageEdges);

  const connection = {
    pageInfo,
    edges: currentPageEdges,
    totalCount: allEdges.length,
  };
  return connection;
};

module.exports = {
  createQuestion,
  markNotApply,
  getAllTags,
  getAnsweredQuestion,
  getUserQuestionConnection,
};
