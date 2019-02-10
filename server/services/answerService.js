const { ObjectId } = require('mongoose').Types;

const getUserAnswers = (Answer, User) => async ({ userId }, context) => {
  const userAnswers = await Answer.find({
    userId: ObjectId(userId),
    $or: [{ isRemoved: { $exists: false } }, { isRemoved: false }],
  })
    .populate('comments.user')
    .sort({ position: 1 });

  return userAnswers;
};

const getUserAnswer = Answer => async ({ userId, questionId, context }) => {
  const userIdObj = typeof userId === 'string' ? ObjectId(userId) : userId;
  const questionIdObj =
    typeof questionId === 'string' ? ObjectId(questionId) : questionId;

  const answer = await Answer.findOne({
    userId: userIdObj,
    questionId: questionIdObj,
  }).populate('comments.user');

  return answer;
};

const getAnswerById = Answer => async ({ answerId, context }) => {
  const answer = await Answer.findById(answerId).populate('comments.user');
  return answer;
};

const getAnswersById = Answer => async ({ answerIds, context }) => {
  const answers = await Answer.find({ _id: { $in: answerIds } }).populate(
    'comments.user'
  );

  return answers;
};

const createEdition = Answer => async ({ answerId, answerValue }, context) => {
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

const edit = Answer => async ({ answerId, answerValue }, context) => {
  const edition = await createEdition({ answerId, answerValue }, context);

  const updatedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { value: answerValue },
      $push: { editions: edition },
    },
    { new: true, upsert: true }
  ).populate('comments.user');

  return updatedAnswer;
};

const add = Answer => async ({ questionId, answerValue }, context) => {
  const { user } = context;

  await Answer.updateMany({}, { $inc: { position: 1 } });
  let addedAnswer;

  const deletedAnswer = await Answer.findOne({
    questionId: ObjectId(questionId),
    userId: ObjectId(user.id),
  }).lean();

  if (deletedAnswer) {
    await edit(
      { answerId: deletedAnswer._id.toString(), answerValue },
      context
    );
    addedAnswer = await Answer.findByIdAndUpdate(deletedAnswer._id, {
      $set: { isRemoved: false, position: 1 },
    }).lean();
  } else {
    const newAnswer = {
      userId: ObjectId(user.id),
      questionId: ObjectId(questionId),
      value: answerValue,
      position: 1,
    };

    addedAnswer = (await Answer.create(newAnswer)).toObject();
  }

  return addedAnswer;
};

const remove = Answer => async ({ answerId }, context) => {
  const removedAnswer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $set: { isRemoved: true },
    },
    { new: true, upsert: true }
  ).populate('comments.user');

  await Answer.updateMany(
    { position: { gt: removedAnswer.position } },
    { $inc: { position: -1 } }
  );

  return removedAnswer;
};

const like = Answer => async (
  { answerId, dbUserLiker, userLikes },
  context
) => {
  /* 

  likes: { total: 27, likers: [{ id: ObjectID(`user`), numOfLikes: 5, .. }]}
*/

  const { likes } = await Answer.findById(answerId).lean();
  let updatedLikes = { total: 0, likers: [] };

  if (!likes) {
    updatedLikes = {
      total: userLikes,
      likers: [{ user: dbUserLiker, numOfLikes: userLikes }],
    };
  } else {
    // clear prev num of likes before adding the new ones
    updatedLikes.likers = likes.likers.filter(
      liker => !liker.user._id.equals(dbUserLiker._id)
    );

    updatedLikes.likers.push({ user: dbUserLiker, numOfLikes: userLikes });
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
  ).populate('comments.user');

  return likedAnswer;
};

const movePosition = Answer => async ({ answerId, position }, context) => {
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

export default (Answer, User) => {
  return {
    add: add(Answer),
    edit: edit(Answer),
    remove: remove(Answer),
    like: like(Answer),
    movePosition: movePosition(Answer),
    getUserAnswer: getUserAnswer(Answer),
    getAnswerById: getAnswerById(Answer),
    getAnswersById: getAnswersById(Answer),
    getUserAnswers: getUserAnswers(Answer, User),
  };
};
