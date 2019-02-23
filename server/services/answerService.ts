import { Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";
import * as GqlTypes from "../generated/gqltypes";
import { ApolloContext } from "../types/gqlContext";
import { Models } from "../models";

const { ObjectId } = GooseTypes;

class AnswerService {
  constructor(private models: Models) {}

  public async getUserAnswers(
    { userId }: { userId: string },
    { models }: ApolloContext
  ): Promise<DbTypes.Answer[]> {
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

  public async getUserAnswer(
    {
      userId,
      questionId
    }: {
      userId: string;
      questionId: string;
    },
    { models }: ApolloContext
  ): Promise<DbTypes.Answer> {
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

  public async getAnswerById(
    answerId: string,
    { models }: ApolloContext
  ): Promise<DbTypes.Answer> {
    const answer = await models.answer
      .findById(answerId)
      .populate("comments.user");
    return answer!.toObject();
  }

  public async getAnswersById(
    {
      answerIds
    }: {
      answerIds: string[];
    },
    { models }: ApolloContext
  ): Promise<DbTypes.Answer[]> {
    const answers = (await models.answer
      .find({ _id: { $in: answerIds } })
      .populate("comments.user")
      .lean()) as DbTypes.Answer[];

    return answers;
  }

  public async edit(
    { answerId, answerValue }: GqlTypes.EditAnswerMutationArgs,
    context: ApolloContext
  ): Promise<DbTypes.Answer> {
    const edition = await this.createEdition(
      { answerId, answerValue },
      context
    );

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

  public async add(
    { questionId, answerValue }: GqlTypes.AddAnswerMutationArgs,
    context: ApolloContext
  ): Promise<DbTypes.Answer> {
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
      await this.edit(
        {
          answerId: deletedAnswer._id.toString(),
          answerValue
        },
        context
      );
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

  public async remove(
    {
      answerId
    }: {
      answerId: string;
    },
    { models }: ApolloContext
  ): Promise<DbTypes.Answer> {
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
      { position: { $gt: removedAnswer.position } },
      { $inc: { position: -1 } }
    );

    return removedAnswer;
  }

  public async like(
    {
      answerId,
      dbUserLiker,
      userLikes
    }: {
      answerId: string;
      dbUserLiker: DbTypes.User;
      userLikes: number;
    },
    { models }: ApolloContext
  ): Promise<DbTypes.Answer> {
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

  public async movePosition(
    {
      answerId,
      position
    }: {
      answerId: string;
      position: number;
    },
    { models }: ApolloContext
  ): Promise<number> {
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

  private async createEdition(
    {
      answerId,
      answerValue
    }: {
      answerId: string;
      answerValue: string;
    },
    { models }: ApolloContext
  ): Promise<DbTypes.Edition> {
    const oldAnswer = await models.answer.findById(answerId).lean();

    const before = oldAnswer.value;
    const after = answerValue;

    return {
      _id: ObjectId(),
      date: new Date(),
      before,
      after
    };
  }
}

export { AnswerService };
