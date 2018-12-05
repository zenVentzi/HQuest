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

const preserveOrder = ({ questionsIds, questions }) => {
  const res = questionsIds
    .map(id => questions.find(q => q._id.equals(id)))
    .filter(q => q); // filters undefined or null values
  return res;
};

const getAnsweredQuestions = async (
  { answers, questionsIds, tags },
  context
) => {
  const {
    models: { Question },
    user,
  } = context;

  const query = { _id: { $in: questionsIds } };

  if (tags && tags.length) {
    query.tags = { $in: tags };
  }

  const questions = await Question.find(query).lean();
  // this is done because the $in query returns in different order
  const orderedQs = preserveOrder({ questionsIds, questions });
  const mergedQuestions = mergeAnswersWithQuestions(answers, orderedQs);
  return mergedQuestions;
};

const getUnansweredQuestions = async ({ questionsIds, tags }, context) => {
  const {
    models: { User, Question },
    user,
  } = context;

  const { questionsNotApply: questionsNotApplyIds } = await User.findById(
    user.id
  ).lean();

  const notInArray = questionsIds.concat(questionsNotApplyIds);

  const query = {
    _id: { $nin: notInArray },
  };

  if (tags && tags.length) {
    query.tags = { $in: tags };
  }

  return Question.find(query).lean();
};

const getQuestionsIds = answers => answers.map(a => a.questionId);

const getNewsFeedQuestions = async ({ newsFeed, context }) => {
  const answerIds = newsFeed.map(news => news.answerId);

  const answers = await answerController.getAnswersById({
    answerIds,
    context,
  });

  const questionsIds = await getQuestionsIds(answers);

  const newsFeedQuestions = await getAnsweredQuestions(
    { answers, questionsIds },
    context
  );

  return newsFeedQuestions;
};

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
  const questionsIds = await getQuestionsIds(args.answers);
  let gqlQuestions;

  if (args.answered) {
    const questions = await getAnsweredQuestions(
      { ...args, questionsIds },
      context
    );

    gqlQuestions = mapGqlQuestions({
      questions,
      loggedUserId: context.user.id,
    });
  } else {
    const questions = await getUnansweredQuestions(
      { ...args, questionsIds },
      context
    );

    gqlQuestions = mapGqlQuestions({
      questions,
      loggedUserId: context.user.id,
    });
  }

  const allEdges = getAllEdges(gqlQuestions);
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
  getNewsFeedQuestions,
  getAnsweredQuestion,
  getUserQuestionConnection,
};
