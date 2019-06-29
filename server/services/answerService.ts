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
      .populate(DbTypes.AnswerPopulatedFields.editions_likes_likers_user)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      )
      .sort({ position: 1 })
      .lean()) as DbTypes.Answer[];

    return userAnswers;
  }

  public async getUserAnswer(
    userId: string,
    questionId: string
  ): Promise<DbTypes.Answer | null> {
    const answer = await this.models.answer
      .findOne({
        userId,
        questionId
      })
      .populate(DbTypes.AnswerPopulatedFields.editions_likes_likers_user)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      );

    return answer ? answer!.toObject() : null;
  }

  public async getAnswerById(answerId: string): Promise<DbTypes.Answer> {
    const answer = await this.models.answer
      .findById(answerId)
      .populate(DbTypes.AnswerPopulatedFields.editions_likes_likers_user)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      );
    return answer!.toObject();
  }

  public async getAnswersById({
    answerIds
  }: {
    answerIds: string[];
  }): Promise<DbTypes.Answer[]> {
    const answers = (await this.models.answer
      .find({ _id: { $in: answerIds } })
      .populate(DbTypes.AnswerPopulatedFields.editions_likes_likers_user)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      )
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
      .populate(DbTypes.AnswerPopulatedFields.editions_likes_likers_user)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      );

    return updatedAnswer.toObject();
  }

  public async add(
    userId: string,
    questionId: string,
    answerValue: string
  ): Promise<DbTypes.Answer> {
    await this.models.answer.updateMany({ userId }, { $inc: { position: 1 } });
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
        userId,
        questionId,
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
      .populate(DbTypes.AnswerPopulatedFields.editions_likes_likers_user)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      )).toObject();

    await this.models.answer.updateMany(
      { position: { $gt: removedAnswer.position } },
      { $inc: { position: -1 } }
    );

    return removedAnswer;
  }
  public async onDeleteAccount(deletedUserId: string): Promise<void> {
    await this.models.answer.deleteMany({ userId: deletedUserId });
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
      .populate(DbTypes.AnswerPopulatedFields.editions_likes_likers_user)
      .populate(DbTypes.AnswerPopulatedFields.editions_comments_user)
      .populate(
        DbTypes.AnswerPopulatedFields.editions_comments_likes_likers_user
      );
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
    let updatedLikes: DbTypes.EditionLikes = { total: 0, likers: [] };

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
    const currentAnswer = await this.models.answer.findById(answerId);
    if (!currentAnswer) {
      throw Error(`Could not find answer with id: ${answerId}`);
    }

    const currentUserId = currentAnswer.userId;
    const currentPos = currentAnswer.position;
    const targetPos = position;
    let searchCondition;
    let updateObject;

    if (targetPos > currentPos) {
      searchCondition = {
        userId: currentUserId,
        position: { $gte: currentPos, $lte: targetPos + 1 }
      };
      updateObject = { $inc: { position: -1 } };
    } else if (targetPos === currentPos) {
      throw Error(`Cannot move to the same position`);
    } else {
      searchCondition = {
        userId: currentUserId,
        position: { $gte: targetPos - 1, $lte: currentPos }
      };
      updateObject = { $inc: { position: 1 } };
    }
    await this.models.answer.updateMany(searchCondition, updateObject);
    currentAnswer.position = targetPos;
    await currentAnswer.save();

    return targetPos;
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
