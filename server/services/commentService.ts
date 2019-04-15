import { Types as GooseTypes, model } from "mongoose";
import * as DbTypes from "../dbTypes";
// import * as GqlTypes from "../generated/gqltypes";
import { Models } from "../models";

const { ObjectId } = GooseTypes;

class CommentService {
  constructor(private models: Models) {}

  public async commentAnswerEdition(
    performerId: string,
    comment: string,
    answerId: string,
    answerEditionId: string
  ): Promise<DbTypes.Comment<DbTypes.CommentPopulatedFields.user>> {
    const performer = (await this.models.user.findById(
      performerId
    ))!.toObject();

    const answer = ((await this.models.answer.findById(
      answerId
    )) as unknown) as DbTypes.AnswerDoc<DbTypes.AnswerPopulatedFields.none>;

    if (!answer) {
      throw Error(`Could not find answer with id ${answerId}`);
    }

    const editionIndex = answer.editions.findIndex(ed =>
      ed._id.equals(answerEditionId)
    );

    let editionComments = answer.editions[editionIndex].comments;
    const addedComment: DbTypes.Comment<DbTypes.CommentPopulatedFields.none> = {
      _id: ObjectId(),
      value: comment,
      user: performer!._id
    };

    if (!editionComments || !editionComments.length) {
      editionComments = [addedComment];
      answer.editions[editionIndex].comments = editionComments;
    } else {
      editionComments.push(addedComment);
    }

    await answer.save();

    const res: DbTypes.Comment = {
      _id: addedComment._id,
      value: addedComment.value,
      user: performer
    };

    return res;
  }

  public async editComment(
    answerId: string,
    answerEditionId: string,
    commentId: string,
    commentValue: string
  ): Promise<DbTypes.Comment<DbTypes.CommentPopulatedFields.user>> {
    const answer = await this.models.answer
      .findById(answerId)
      .populate(DbTypes.CommentPopulatedFields.user);
    if (!answer) {
      throw Error(`Could not find answer with id ${answerId}`);
    }
    const edition = answer.editions.find(ed => ed._id.equals(answerEditionId));
    if (!edition) {
      throw Error(`Could not find edition with id ${answerEditionId}`);
    }

    let editedComment:
      | DbTypes.Comment<DbTypes.CommentPopulatedFields.user>
      | undefined;

    if (!edition.comments || !edition.comments.length) {
      throw Error(`Edition with id ${answerEditionId} , has no comments`);
    } else {
      edition.comments.forEach(comment => {
        if (comment._id.equals(commentId)) {
          comment.value = commentValue;
          editedComment = comment;
        }
      });
      if (!editedComment) {
        throw Error(`Could not find comment with id ${commentId}`);
      }
      await answer.save();
      return editedComment;
    }
  }

  public async removeComment(
    answerId: string,
    answerEditionId: string,
    commentId: string
  ): Promise<DbTypes.Comment<DbTypes.CommentPopulatedFields.user>> {
    const answer = await this.models.answer
      .findById(answerId)
      .populate(DbTypes.CommentPopulatedFields.user);

    if (!answer) {
      throw Error(`Could not find answer with id ${answerId}`);
    }
    const edition = answer.editions.find(ed => ed._id.equals(answerEditionId));
    if (!edition) {
      throw Error(
        `Could not find answer edition.
         AnswerId: ${answerId} EditionId: ${answerEditionId}`
      );
    }
    if (!edition.comments || !edition.comments.length) {
      throw Error(`Edition has no comments. EditionId: ${answerEditionId}`);
    }
    const deletedComment = edition.comments.find(com =>
      com._id.equals(commentId)
    );
    if (!deletedComment) {
      throw Error(`Could not find comment to delete. CommentId: ${commentId}`);
    }
    const updatedComments = edition.comments.filter(
      com => !com._id.equals(commentId)
    );
    edition.comments = updatedComments;
    await answer.save();
    return deletedComment;
  }
}

export { CommentService };
