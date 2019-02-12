import { Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";
import { ApolloContext } from "../types/gqlContext";

const { ObjectId } = GooseTypes;

async function getUserAnswers({
  userId,
  context: { models }
}: {
  userId: string;
  context: ApolloContext;
}): Promise<DbTypes.Answer[]> {
  const userAnswers = (await models.answer
    .find({
      userId: ObjectId(userId),
      $or: [{ isRemoved: { $exists: false } }, { isRemoved: false }]
    })
    .populate("comments.user")
    .sort({ position: 1 })
    .lean()) as DbTypes.Answer[];

  return userAnswers;
}

async function getUserAnswer({
  userId,
  questionId,
  context: { models }
}: {
  userId: string;
  questionId: string;
  context: ApolloContext;
}): Promise<DbTypes.Answer> {
  const userIdObj = typeof userId === "string" ? ObjectId(userId) : userId;
  const questionIdObj =
    typeof questionId === "string" ? ObjectId(questionId) : questionId;

  const answer = await models.answer
    .findOne({
      userId: userIdObj,
      questionId: questionIdObj
    })
    .populate("comments.user");

  return answer!.toObject();
}

async function getAnswerById({
  answerId,
  context: { models }
}: {
  answerId: string;
  context: ApolloContext;
}): Promise<DbTypes.Answer> {
  const answer = await models.answer
    .findById(answerId)
    .populate("comments.user");
  return answer!.toObject();
}

async function getAnswersById({
  answerIds,
  context: { models }
}: {
  answerIds: string[];
  context: ApolloContext;
}): Promise<DbTypes.Answer[]> {
  const answers = (await models.answer
    .find({ _id: { $in: answerIds } })
    .populate("comments.user")
    .lean()) as DbTypes.Answer[];

  return answers;
}

async function createEdition({
  answerId,
  answerValue,
  context: { models }
}: {
  answerId: string;
  answerValue: string;
  context: ApolloContext;
}): Promise<DbTypes.Edition> {
  const oldAnswer = await models.answer.findById(answerId).lean();

  const before = oldAnswer.value;
  const after = answerValue;

  return {
    _id: ObjectId(),
    date: new Date().toISOString(),
    before,
    after
  };
}

async function edit({
  answerId,
  answerValue,
  context
}: {
  answerId: string;
  answerValue: string;
  context: ApolloContext;
}): Promise<DbTypes.Answer> {
  const edition = await createEdition({ answerId, answerValue, context });

  const updatedAnswer = await context.models.answer
    .findByIdAndUpdate(
      answerId,
      {
        $set: { value: answerValue },
        $push: { editions: edition }
      },
      { new: true, upsert: true }
    )
    .populate("comments.user");

  return updatedAnswer.toObject();
}

async function add({
  questionId,
  answerValue,
  context
}: {
  questionId: string;
  answerValue: string;
  context: ApolloContext;
}): Promise<DbTypes.Answer> {
  const { user, models } = context;

  await models.answer.updateMany({}, { $inc: { position: 1 } });
  let addedAnswer: DbTypes.Answer;

  const deletedAnswer = await models.answer
    .findOne({
      questionId: ObjectId(questionId),
      userId: ObjectId(user!.id)
    })
    .lean();

  if (deletedAnswer) {
    await edit({
      answerId: deletedAnswer._id.toString(),
      answerValue,
      context
    });
    addedAnswer = (await models.answer.findByIdAndUpdate(deletedAnswer._id, {
      $set: { isRemoved: false, position: 1 }
    }))!.toObject();
  } else {
    const newAnswer = {
      userId: ObjectId(user!.id),
      questionId: ObjectId(questionId),
      value: answerValue,
      position: 1
    };

    addedAnswer = (await models.answer.create(newAnswer)).toObject();
  }

  return addedAnswer;
}

async function remove({
  answerId,
  context: { models }
}: {
  answerId: string;
  context: ApolloContext;
}): Promise<DbTypes.Answer> {
  const removedAnswer = (await models.answer
    .findByIdAndUpdate(
      answerId,
      {
        $set: { isRemoved: true }
      },
      { new: true, upsert: true }
    )
    .populate("comments.user")).toObject();

  await models.answer.updateMany(
    { position: { gt: removedAnswer.position } },
    { $inc: { position: -1 } }
  );

  return removedAnswer;
}

async function like({
  answerId,
  dbUserLiker,
  userLikes,
  context: { models }
}: {
  answerId: string;
  dbUserLiker: DbTypes.User;
  userLikes: number;
  context: ApolloContext;
}): Promise<DbTypes.Answer> {
  /* 

  likes: { total: 27, likers: [{ id: ObjectID(`user`), numOfLikes: 5, .. }]}
*/

  const { likes } = await models.answer.findById(answerId).lean();
  let updatedLikes: DbTypes.Likes = { total: 0, likers: [] };

  if (!likes) {
    updatedLikes = {
      total: userLikes,
      likers: [{ user: dbUserLiker, numOfLikes: userLikes }]
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

  const likedAnswer = await models.answer
    .findByIdAndUpdate(
      answerId,
      {
        $set: { likes: updatedLikes }
      },
      { new: true, upsert: true }
    )
    .populate("comments.user");

  return likedAnswer.toObject();
}

async function movePosition({
  answerId,
  position,
  context: { models }
}: {
  answerId: string;
  position: number;
  context: ApolloContext;
}): Promise<number> {
  const currentAnswer = await models.answer.findById(answerId).lean();
  await models.answer.findOneAndUpdate(
    { position },
    { $set: { position: currentAnswer.position } }
  );

  await models.answer.findByIdAndUpdate(answerId, {
    $set: { position }
  });

  return position;
}

export const answerService = {
  add,
  edit,
  remove,
  like,
  movePosition,
  getUserAnswer,
  getAnswerById,
  getAnswersById,
  getUserAnswers
};
