const { ObjectId } = require('mongoose').Types;

const addQuestions = Question => async ({ questions }) => {
  await Question.create(questions);
};

const markNotApply = Question => async ({ questionId, loggedUserId }) => {
  // old way
  // await User.findByIdAndUpdate(
  //   user.id,
  //   { $push: { questionsNotApply: ObjectId(questionId) } },
  //   { new: true, upsert: true }
  // );

  return Question.findByIdAndUpdate(
    questionId,
    { $push: { notApplyToUsers: loggedUserId } },
    { new: true, upsert: true }
  ).lean();

  // return Question.findById(questionId).lean();
};

const getAllTags = Question => async () => {
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
  const result = [];
  const mergedAnswers = [];

  questions.forEach(question => {
    const answer = answers.find(
      a =>
        a.questionId.equals(question._id) &&
        !mergedAnswers.some(ma => ma._id.equals(a._id))
    );
    const mergedQA = mergeAnswerWithQuestion(answer, question);
    mergedAnswers.push(answer);
    result.push(mergedQA);
  });

  return result;
};

// const getAnsweredQuestion = Question => async (userId, questionId, context) => {
//   const answer = await answerController.getUserAnswer({
//     userId,
//     questionId,
//     context,
//   });
//   const question = await Question.findById(questionId).lean();
//   const answeredQuestion = mergeAnswerWithQuestion(answer, question);
//   return answeredQuestion;
// };

const getQuestion = Question => async ({ questionId }) => {
  return Question.findById(questionId).lean();
};

const preserveOrder = ({ questionsIds, questions }) => {
  const res = questionsIds
    .map(id => questions.find(q => q._id.equals(id)))
    .filter(q => q); // filters undefined or null values
  return res;
};

const getAnsweredQuestions = Question => async ({
  answers,
  questionsIds,
  tags,
}) => {
  const query = { _id: { $in: questionsIds } };

  if (tags && tags.length) {
    query.tags = { $in: tags };
  }

  const questions = await Question.find(query).lean();
  // ordering is done because the $in query returns in random order
  const orderedQs = preserveOrder({ questionsIds, questions });
  const mergedQuestions = mergeAnswersWithQuestions(answers, orderedQs);
  return mergedQuestions;
};

const getUnansweredQuestions = Question => async ({
  questionsIds,
  loggedUserId,
  tags,
}) => {
  const query = {
    _id: { $in: questionsIds },
  };

  if (tags && tags.length) {
    query.tags = { $in: tags };
  }

  const questions = await Question.find(query).lean();

  return questions.filter(q => {
    if (!q.notApplyToUsers) return true;
    return !q.notApplyToUsers.includes(loggedUserId);
  });
};

const getQuestionsIds = answers => answers.map(a => a.questionId);

const getUserQuestions = Question => async ({ ...args }) => {
  const questionsIds = await getQuestionsIds(args.answers);
  let questions;

  if (args.answered) {
    questions = await getAnsweredQuestions(Question)({ ...args, questionsIds });
  } else {
    questions = await getUnansweredQuestions(Question)({
      ...args,
      questionsIds,
    });
  }

  return questions;
};

export const questionService = {
  addQuestions,
  markNotApply,
  getAllTags,
  getQuestion,
  getUserQuestions,
};
