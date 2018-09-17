const { ObjectId } = require('mongoose').Types;
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
  } = context;

  const answerQuery = {
    userId: ObjectId(userId),
    questionId: ObjectId(questionId),
  };

  const answer = await Answer.findOne(answerQuery).lean();
  const question = await Question.findById(questionId).lean();
  const answeredQuestion = mergeAnswerWithQuestion(answer, question);
  return mapGqlQuestion(answeredQuestion);
};

const getUserAnsweredQuestions = async (
  { answers, answeredQuestionsIds, tags },
  context
) => {
  const {
    models: { Question },
  } = context;

  const query = { _id: { $in: answeredQuestionsIds } };

  if (tags.length) {
    query.tags = { $in: tags };
  }

  const questions = await Question.find(query).lean();

  return mapGqlQuestions(mergeAnswersWithQuestions(answers, questions));
};

const getUserUnansweredQuestions = async (
  { answeredQuestionsIds, tags },
  context
) => {
  const {
    models: { Question },
  } = context;

  const query = { _id: { $nin: answeredQuestionsIds } };

  if (tags.length) {
    query.tags = { $in: tags };
  }

  const questions = await Question.find(query).lean();

  return mapGqlQuestions(questions);
};

const getAnsweredQuestionsIds = answers => answers.map(a => a.questionId);

const getUserQuestionsPage = async (args, context) => {
  const {
    models: { Question },
  } = context;

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

  const hasPreviousPage = async () => {
    let result = false;

    if (args.after) {
      const hasPrevQuery = {
        _id: { $in: answeredQuestionsIds, $lt: ObjectId(args.after) },
      };
      const prevQuestions = await Question.find(hasPrevQuery)
        .limit(1)
        .lean();
      const hasPreviousQuestions = !!prevQuestions.length;
      result = hasPreviousQuestions;
    }

    return result;
  };

  const hasNextPage = async () => {
    if (!questions.length) return false;
    const lastQuestionId = questions[questions.length - 1]._id;
    const questionsAfterLast = await Question.find({
      _id: { $in: answeredQuestionsIds, $gt: lastQuestionId },
    })
      .limit(1)
      .lean();
    const hasMoreQuestions = !!questionsAfterLast.length;
    return hasMoreQuestions;
  };

  let startCursor;
  let endCursor;

  if (questions.length) {
    startCursor = questions[0]._id.toString();
    endCursor = questions[questions.length - 1]._id.toString();
  }
  const res = {
    questions: mapGqlQuestions(questions) || [],
    startCursor,
    endCursor,
    hasPreviousPage: await hasPreviousPage(),
    hasNextPage: await hasNextPage(),
  };
  return res;
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
  const startIndex = after ? allEdges.findIndex(e => e.cursor === after) : 0;
  const endIndex = first;
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

  const connection = { pageInfo, edges: currentPageEdges };
  return connection;
};

module.exports = {
  createQuestion,
  getAllTags,
  getAnsweredQuestion,
  getUserQuestionConnection,
};
