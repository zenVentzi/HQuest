const { ObjectID } = require('mongodb');
const { gqlComment, gqlUser } = require('../helper');

async function books(root, __, context) {
  const { collections } = context;

  const result = await collections.books.find().toArray();
  return result;
}

async function comments(_, { answerId }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;
  const answer = await collections.answers.findOne({
    _id: ObjectID(answerId),
  });

  const { comments: dbComments } = answer;

  if (!dbComments.length) return [];

  const promises = dbComments.map(async dbCom => {
    const dbUser = await collections.users.findOne({
      _id: dbCom.userId,
    });
    return gqlComment(context, dbUser, dbCom);
  });

  return Promise.all(promises);
}

async function gqlUnansweredQs(collections, userId) {
  const userAnswers = await collections.answers
    .find({ userId: ObjectID(userId) })
    .toArray();

  const answeredQsIds = userAnswers.map(answer => answer.questionId);
  const unansweredQs = await collections.questions
    .find({
      _id: { $nin: answeredQsIds },
    })
    .toArray();

  return unansweredQs.map(q => ({
    id: q._id.toString(),
    question: q.question,
    type: q.type,
    possibleAnswers: q.possibleAnswers,
  }));
}

async function gqlAnsweredQs(collections, userId) {
  const userAnswers = await collections.answers
    .find({ userId: ObjectID(userId) })
    .toArray();

  const answeredQsIds = userAnswers.map(answer => answer.questionId);
  const answeredQs = await collections.questions
    .find({
      _id: { $in: answeredQsIds },
    })
    .toArray();

  return userAnswers.map(answer => {
    const qId = answer.questionId;
    const dbQuestion = answeredQs.find(q => q._id.equals(qId));

    return {
      id: dbQuestion._id.toString(),
      question: dbQuestion.question,
      type: dbQuestion.type,
      possibleAnswers: dbQuestion.possibleAnswers,
      answer: { id: answer._id.toString(), value: answer.value },
    };
  });
}

async function questions(root, { userId, all }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;

  return {
    answered: await gqlAnsweredQs(collections, userId),
    unanswered: all ? await gqlUnansweredQs(collections, userId) : [],
  };
}

async function users(_, { match }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const { collections } = context;
  const matchWords = match.split(' ');

  let matchedUsers;

  if (matchWords.length > 2) {
    return [];
  } else if (matchWords.length === 2) {
    const fNameRegex = new RegExp(`.*${matchWords[0]}.*`, `i`);
    const surNameRegex = new RegExp(`.*${matchWords[1]}.*`, `i`);

    matchedUsers = await collections.users
      .find({
        $and: [
          { firstName: { $regex: fNameRegex } },
          { surName: { $regex: surNameRegex } },
        ],
      })
      .toArray();
  } else {
    const regex = new RegExp(`.*${match}.*`, `i`);
    matchedUsers = await collections.users
      .find({
        $or: [{ firstName: { $regex: regex } }, { surName: { $regex: regex } }],
      })
      .toArray();
  }

  /* 
  problem: when writing the full name, the regex doesn't match
  solution: check if the match variable contains space. if it does, split it into regex1 & regex2
  */
  const result = matchedUsers.map(usr => gqlUser(context, usr));

  return result;
}

async function user(_, { id }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const dbUser = await context.collections.users.findOne({ _id: ObjectID(id) });

  if (!dbUser) return null;
  const usr = gqlUser(context, dbUser);
  return usr;
}

module.exports = {
  books,
  comments,
  users,
  user,
  questions,
};
