import { Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";
// import * as GqlTypes from "../graphql/autoGenTypes";
import { Models } from "../models";

const { ObjectId } = GooseTypes;

class AnswerService {
  constructor(private models: Models) {}

  public async getUserAnswers(userId: string): Promise<DbTypes.Answer[]> {
    const userAnswers = (await this.models.answer
      .find({
        userId: ObjectId(userId),
        $or: [{ isRemoved: { $exists: false } }, { isRemoved: false }]
      })
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .sort({ position: 1 })
      .lean()) as DbTypes.Answer[];

    return userAnswers;
  }

  public async getUserAnswer(
    userId: string,
    questionId: string
  ): Promise<DbTypes.Answer> {
    const userIdObj = typeof userId === "string" ? ObjectId(userId) : userId;
    const questionIdObj =
      typeof questionId === "string" ? ObjectId(questionId) : questionId;

    const answer = await this.models.answer
      .findOne({
        userId: userIdObj,
        questionId: questionIdObj
      })
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user);

    return answer!.toObject();
  }

  public async getAnswerById(answerId: string): Promise<DbTypes.Answer> {
    const answer = await this.models.answer
      .findById(answerId)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user);
    return answer!.toObject();
  }

  public async getAnswersById({
    answerIds
  }: {
    answerIds: string[];
  }): Promise<DbTypes.Answer[]> {
    const answers = (await this.models.answer
      .find({ _id: { $in: answerIds } })
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .lean()) as DbTypes.Answer[];

    return answers;
  }

  public async edit(
    answerId: string,
    answerValue: string
  ): Promise<DbTypes.Answer> {
    const edition = await this.createEdition(answerId, answerValue);

    const updatedAnswer = await this.models.answer
      .findByIdAndUpdate(
        answerId,
        {
          $set: { value: answerValue },
          $push: { editions: edition }
        },
        { new: true, upsert: true }
      )
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user);

    return updatedAnswer.toObject();
  }

  public async add(
    userId: string,
    questionId: string,
    answerValue: string
  ): Promise<DbTypes.Answer> {
    await this.models.answer.updateMany({}, { $inc: { position: 1 } });
    let addedAnswer: DbTypes.Answer;

    const deletedAnswer = await this.models.answer
      .findOne({
        questionId: ObjectId(questionId),
        userId: ObjectId(userId)
      })
      .lean();

    if (deletedAnswer) {
      await this.edit(deletedAnswer._id.toString(), answerValue);
      addedAnswer = (await this.models.answer.findByIdAndUpdate(
        deletedAnswer._id,
        {
          $set: { isRemoved: false, position: 1 }
        }
      ))!.toObject();
    } else {
      const newAnswer: DbTypes.Answer = {
        _id: ObjectId(),
        position: 1,
        userId: ObjectId(userId),
        questionId: ObjectId(questionId),
        editions: [{ _id: ObjectId(), date: new Date(), value: answerValue }]
      };

      addedAnswer = (await this.models.answer.create(newAnswer)).toObject();
    }

    return addedAnswer;
  }

  public async remove(answerId: string): Promise<DbTypes.Answer> {
    const removedAnswer = (await this.models.answer
      .findByIdAndUpdate(
        answerId,
        {
          $set: { isRemoved: true }
        },
        { new: true, upsert: true }
      )
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_user
      )).toObject();

    await this.models.answer.updateMany(
      { position: { $gt: removedAnswer.position } },
      { $inc: { position: -1 } }
    );

    return removedAnswer;
  }

  // FIXME
  public async like(
    answerId: string,
    editionId: string,
    likerId: string,
    userLikes: number
  ): Promise<DbTypes.Edition> {
    const answer = await this.models.answer
      .findById(answerId)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user);
    if (!answer) {
      throw Error(`Couldn't find answer with id ${answerId}`);
    }
    const edition = answer.editions.find(e => e._id.equals(editionId));
    const editionIndex = answer.editions.findIndex(e =>
      e._id.equals(editionId)
    );
    if (!edition) {
      throw Error(
        `Couldn't find edition. AnswerId: ${answerId} EditionId: ${editionId}`
      );
    }
    const { likes } = edition;
    let updatedLikes: DbTypes.Likes = { total: 0, likers: [] };

    const liker = (await this.models.user.findById(likerId))!.toObject();

    if (!likes) {
      updatedLikes = {
        total: userLikes,
        likers: [{ user: liker, numOfLikes: userLikes }]
      };
    } else {
      // clear prev num of likes before adding the new ones
      updatedLikes.likers = likes.likers.filter(
        likerr => !likerr.user._id.equals(liker._id)
      );

      updatedLikes.likers.push({ user: liker, numOfLikes: userLikes });
      updatedLikes.total = updatedLikes.likers.reduce((total, likerr) => {
        const res = total + likerr.numOfLikes;
        return res;
      }, 0);
    }

    answer.editions[editionIndex].likes = updatedLikes;
    await answer.save();
    return answer.toObject().editions[editionIndex];
  }

  public async movePosition(
    answerId: string,
    position: number
  ): Promise<number> {
    const currentAnswer = await this.models.answer.findById(answerId).lean();
    await this.models.answer.findOneAndUpdate(
      { position },
      { $set: { position: currentAnswer.position } }
    );

    await this.models.answer.findByIdAndUpdate(answerId, {
      $set: { position }
    });

    return position;
  }

  private async createEdition(
    answerId: string,
    answerValue: string
  ): Promise<DbTypes.Edition> {
    const oldAnswer: DbTypes.Answer = await this.models.answer
      .findById(answerId)
      .lean();

    // const before = oldAnswer.value;
    // const after = answerValue;

    return {
      _id: ObjectId(),
      date: new Date(),
      value: answerValue
    };
  }
}

export { AnswerService };
