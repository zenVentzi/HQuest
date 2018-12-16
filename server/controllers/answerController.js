const { ObjectId } = require('mongoose').Types;
const bcrypt = require('bcrypt');
const { QuestionTypes } = require('../constants');
const { mapGqlAnswer } = require('../resolvers/helper');

const getComentators = async ({ userAnswers, context }) => {
  const {
    models: { User },
  } = context;

  const commentatorsIds = userAnswers.reduce(
    (userIdsFromAllAnswers, answer) => {
      const { comments: answerComments } = answer;

      if (answerComments) {
        answerComments.forEach(com => {
          if (!userIdsFromAllAnswers.includes(com.userId.toString())) {
            userIdsFromAllAnswers.push(com.userId.toString());
          }
        });
      }

      return userIdsFromAllAnswers;
    },
    []
  );

  const commentatorsObjs = await User.find({
    _id: { $in: commentatorsIds },
  }).lean();

  return commentatorsObjs;
};

const swapUserIdForUserObj = ({ commentators, userAnswers }) => {
  const res = userAnswers.map(answ => {
    if (!answ.comments) {
      return answ;
    }

    const answerWithUpdatedComments = { ...answ };
    delete answerWithUpdatedComments.comments;

    answerWithUpdatedComments.comments = answ.comments.map(comment => {
      const commentWithUserObj = { ...comment };
      delete commentWithUserObj.userId;
      commentWithUserObj.user = commentators.find(comObj =>
        comObj._id.equals(comment.userId)
      );
      return commentWithUserObj;
    });

    return answerWithUpdatedComments;
  });

  return res;
};

const addUserObjToComments = async ({ userAnswers, context }) => {
  const commentators = await getComentators({ userAnswers, context });

  const answersWithUpdatedComments = swapUserIdForUserObj({
    commentators,
    userAnswers,
  });

  return answersWithUpdatedComments;
};

const getUserAnswers = async ({ userId }, context) => {
  const {
    models: { Answer },
  } = context;

  const userAnswers = await Answer.find({
    userId: ObjectId(userId),
    $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
  })
    .sort({ position: 1 })
    .lean();

  const res = await addUserObjToComments({ userAnswers, context });

  return res;
};

const getUserAnswer = async ({ userId, questionId, context }) => {
  const {
    models: { Answer },
  } = context;

  const userIdObj = typeof userId === 'string' ? ObjectId(userId) : userId;
  const questionIdObj =
    typeof questionId === 'string' ? ObjectId(questionId) : questionId;

  const answer = await Answer.findOne({
    userId: userIdObj,
    questionId: questionIdObj,
  }).lean();

  const [res] = await addUserObjToComments({ userAnswers: [answer], context });

  return res;

  /* problem is that if I don't return mapped result, it becomes incosistent with the other functions. But I need an unmapped result in this case
  
  solution1: pass parameter shouldMap that defaults to true and mark it as false. If false just return rawDbObject.
  
  solution2: don't return mapped objects from controllers. Map the results in the query & mutation files */
};

const getAnswerById = async ({ answerId, context }) => {
  const {
    models: { Answer },
  } = context;

  const answer = await Answer.findById(answerId).lean();
  const [res] = await addUserObjToComments({ userAnswers: [answer], context });
  return res;
};

const getAnswersById = async ({ answerIds, context }) => {
  const {
    models: { Answer },
  } = context;

  const answers = await Answer.find({ _id: { $in: answerIds } }).lean();
  const res = await addUserObjToComments({ userAnswers: answers, context });
  return res;
};

const createEdition = async ({ answerId, answerValue }, context) => {
  const {
    models: { Answer },
  } = context;

  const oldAnswer = await Answer.findById(answerId).lean();

  const before = oldAnswer.value;
  const after = answerValue;

  return {
    id: ObjectId(),
    date: new Date().toISOString(),
    before,
    after,
  };
};

const edit = async ({ answerId, answerValue }, context) => {
  const {
    models: { Answer },
  } = context;

  const edition = await createEdition({ answerId, answerValue }, context);

  const updatedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { value: answerValue },
      $push: { editions: edition },
    },
    { new: true, upsert: true }
  ).lean();

  return updatedAnswer;
};

const add = async ({ questionId, answerValue }, context) => {
  const {
    models: { Answer },
    user,
  } = context;

  await Answer.updateMany({}, { $inc: { position: 1 } });
  let result;

  const deletedAnswer = await Answer.findOne({
    questionId: ObjectId(questionId),
    userId: ObjectId(user.id),
  }).lean();

  if (deletedAnswer) {
    await edit(
      { answerId: deletedAnswer._id.toString(), answerValue },
      context
    );
    result = await Answer.findByIdAndUpdate(deletedAnswer._id, {
      $set: { isDeleted: false, position: 1 },
    }).lean();
  } else {
    const newAnswer = {
      userId: ObjectId(user.id),
      questionId: ObjectId(questionId),
      comments: [],
      value: answerValue,
      position: 1,
    };

    result = await Answer.create(newAnswer);
  }

  return result;
};

const remove = async ({ answerId }, context) => {
  const {
    models: { Answer },
    user,
  } = context;

  const deletedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { isDeleted: true },
    },
    { new: true, upsert: true }
  ).lean();

  await Answer.updateMany(
    { position: { gt: deletedAnswer.position } },
    { $inc: { position: -1 } }
  );

  return mapGqlAnswer({ answer: deletedAnswer, loggedUserId: user.id });
};

const like = async ({ answerId, numOfLikes }, context) => {
  const {
    models: { Answer, User },
    user,
  } = context;
  /* 

  likes: { total: 27, likers: [{ id: ObjectID(`user`), numOfLikes: 5, .. }]}
*/

  const { likes } = await Answer.findById(answerId).lean();
  const dbUserLiker = await User.findById(user.id).lean();
  let updatedLikes = { total: 0, likers: [] };

  if (!likes) {
    updatedLikes = {
      total: numOfLikes,
      likers: [{ user: dbUserLiker, numOfLikes }],
    };
  } else {
    // clear prev num of likes before adding the new ones
    updatedLikes.likers = likes.likers.filter(
      liker => !liker.user._id.equals(dbUserLiker._id)
    );

    updatedLikes.likers.push({ user: dbUserLiker, numOfLikes });
    updatedLikes.total = updatedLikes.likers.reduce((total, liker) => {
      const res = total + liker.numOfLikes;
      return res;
    }, 0);
  }

  const likedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { likes: updatedLikes },
    },
    { new: true, upsert: true }
  ).lean();

  const [answerWithUpdatedComments] = await addUserObjToComments({
    userAnswers: [likedAnswer],
    context,
  });

  return answerWithUpdatedComments;
};

const movePosition = async ({ answerId, position }, context) => {
  const {
    models: { Answer },
  } = context;

  const answersCount = await Answer.count();
  // const reversedPosition = answersCount - position + 1;
  const currentAnswer = await Answer.findById(answerId).lean();
  await Answer.findOneAndUpdate(
    { position },
    { $set: { position: currentAnswer.position } }
  );

  await Answer.findByIdAndUpdate(answerId, {
    $set: { position },
  });

  return position;
};

module.exports = {
  add,
  edit,
  remove,
  like,
  movePosition,
  getUserAnswer,
  getAnswersById,
  getUserAnswers,
  getAnswerById,
};
