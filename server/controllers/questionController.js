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

const mergeAnswersWithQuestions = (answers, questions) => {
  const pairs = answers.map(answer => {
    const question = questions.find(q => q._id.equals(answer.questionId));
    return mergeAnswerWithQuestion(answer, question);
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
  const answeredQuestion = mergeAnswerWithQuestion(answer, question);
  return mapGqlQuestion(answeredQuestion);
};

const getUserAnswers = async ({ userId }, context) => {
  const {
    models: { Answer },
  } = context;

  return Answer.find({ userId: ObjectId(userId) }).lean();
};

const getAnsweredQuestionsIds = async answers => {
  return answers.map(a => a.questionId);
};

const getUserAnsweredQuestions = async (
  { userId, tags, first, after },
  context
) => {
  const {
    models: { Question },
  } = context;

  const answers = await getUserAnswers({ userId }, context);
  const answeredQuestionsIds = await getAnsweredQuestionsIds(answers);

  const limit = first;

  const query = { _id: { $in: answeredQuestionsIds } };

  if (after) {
    query._id = { ...query._id, $gt: ObjectId(after) };
  }

  if (tags.length) {
    query.tags = { $in: tags };
  }

  const questions = await Question.find(query)
    .limit(limit)
    .lean();

  const hasPreviousPage = async () => {
    let result = false;

    if (after) {
      const hasPrevQuery = {
        _id: { $in: answeredQuestionsIds, $lt: ObjectId(after) },
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
    const lastQuestionId = questions[questions.length - 1]._id;
    const questionsAfterLast = await Question.find({
      _id: { $in: answeredQuestionsIds, $gt: lastQuestionId },
    })
      .limit(1)
      .lean();
    const hasMoreQuestions = !!questionsAfterLast.length;
    return hasMoreQuestions;
  };
  /* 
  TODO: the hasNextPrev logic can be abstracted 1 layer up
  basically, a HOF that will take the first and last elements and
  check if there are more before or after them
  */
  let startCursor;
  let endCursor;

  if (questions.length) {
    startCursor = questions[0]._id.toString();
    endCursor = questions[questions.length - 1]._id.toString();
  }
  const res = {
    questions: questions || [],
    startCursor,
    endCursor,
    hasPreviousPage: await hasPreviousPage(),
    hasNextPage: await hasNextPage(),
  };
  return res;
};

const getUserUnansweredQuestions = async (
  { userId, tags, first, after },
  context
) => {
  const {
    models: { Question },
  } = context;

  const { answers } = await getUserAnswers({ userId }, context);
  const answeredQuestionsIds = await getAnsweredQuestionsIds(answers);

  const query = {
    _id: { $nin: answeredQuestionsIds },
  };

  if (tags.length) {
    query.tags = { $in: tags };
  }

  const limit = first;
  let beginFromId;

  if (after) {
    beginFromId = ObjectId(after);
  } else {
    beginFromId = await Question.find(query).limit(1);
  }

  query._id = { ...query._id, $gt: beginFromId };

  const res =
    (await Question.find(query)
      .limit(limit)
      .lean()) || [];
  return res;
};

const getEdges = nodes => {
  return nodes.map(node => {
    const cursor = node.id;
    return {
      cursor,
      node,
    };
  });
};

const getAnsweredQuestionsConnection = async (args, context) => {
  const {
    questions,
    startCursor,
    endCursor,
    hasPreviousPage,
    hasNextPage,
  } = await getUserAnsweredQuestions(args, context);
  const answers = await getUserAnswers(args, context);
  const merged = mergeAnswersWithQuestions(answers, questions);
  const nodes = mapGqlQuestions(merged);
  const edges = getEdges(nodes);

  const pageInfo = { startCursor, endCursor, hasNextPage, hasPreviousPage };
  const connection = { pageInfo, edges };
  return connection;
};
const getUnansweredQuestionsEdges = async (args, context) => {
  /* 
  interface Edge {
  cursor : String!
  node: Node!
} */

  const {
    questions,
    hasPreviousPage,
    hasNextPage,
  } = await getUserUnansweredQuestions(args, context);
  const nodes = mapGqlQuestions(questions);
  return getEdges(nodes);
};

const getPageInfo = edges => {
  const startCursor = edges[0].cursor;
  const endCursor = edges[edges.length - 1].cursor;
  /* 
    const hasNextPage = is the endCursor the last in the collection
    const hasPreviousPage = is are there other edges before the startCursor
  */
  const hasNextPage = isLastInCollection(endCursor);
  const hasPreviousPage = isFirstInCollection(startCursor);
  return {
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
  };
};

const getUserQuestionConnection = async (args, context) => {
  let connection;

  if (args.answered) {
    connection = await getAnsweredQuestionsConnection(args, context);
  } else {
    connection = await getUnansweredQuestionsEdges(args, context);
  }

  return connection;
};

const getUserQuestions = async (args, context) => {
  let result;

  if (args.answered) {
    const answeredQuestions = await getUserAnsweredQuestions(args, context);
    const answers = await getUserAnswers(args, context);
    const merged = mergeAnswersWithQuestions(answers, answeredQuestions);
    result = mapGqlQuestions(merged);
  } else {
    const unansweredQuestions = await getUserUnansweredQuestions(args, context);
    result = mapGqlQuestions(unansweredQuestions);
  }

  return result;
};

module.exports = {
  createQuestion,
  getAllTags,
  getAnsweredQuestion,
  getUserQuestionConnection,
};
