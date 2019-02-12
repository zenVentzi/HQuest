import { Types as GooseTypes, model } from "mongoose";
import * as DbTypes from "../dbTypes";
import * as GqlTypes from "../generated/gqltypes";
import { ApolloContext } from "../types/gqlContext";

const { ObjectId } = GooseTypes;

async function addCommentToAnswer(
  { comment, answerId }: GqlTypes.CommentAnswerMutationArgs,
  context: ApolloContext
) {
  const { models, user } = context;
  const performerId = user!.id;

  const performer = (await models.user.findById(performerId))!.toObject();

  const dbAnswer = (await models.answer
    .findByIdAndUpdate(
      answerId,
      {
        $push: {
          comments: { _id: ObjectId(), value: comment, user: performer!._id }
        }
      },
      { new: true }
      // { new: true, fields: "comments -_id" }
    )
    .populate("comments.user"))!.toObject();

  const dbComments = dbAnswer!.comments;

  const addedComment = dbComments![dbComments!.length - 1];
  return addedComment;
}

// async function editComment({
//   answerId,
//   commentId,
//   commentValue,
//   context
// }: {
//   answerId: string;
//   commentId: string;
//   commentValue: string;
//   context: ApolloContext;
// }) {
//   const { models } = context;

//   const answerDoc = await models.answer
//     .findById(answerId)
//     .populate("comments.user");

//   if (answerDoc) {
//     answerDoc.comments!.forEach(c => (c.value = "fdf"));
//     await answerDoc.save();
//     return answerDoc.comments!.find(c => c._id.toHexString() === commentId);
//   }

//   throw Error("Failed to edit comment");
// }
async function editComment(
  { answerId, commentId, commentValue }: GqlTypes.EditCommentMutationArgs,
  context: ApolloContext
) {
  const { models } = context;

  const { comments: oldComments } = (await models.answer
    .findById(answerId)
    .populate("user"))!.toObject();
  const newComments: DbTypes.Comment[] = [];
  let editedComment: DbTypes.Comment | undefined;

  oldComments!.forEach(oldC => {
    const newComment = oldC;

    if (oldC._id.toString() === commentId) {
      newComment.value = commentValue;
      editedComment = newComment;
    }

    newComments.push(newComment);
  });

  await models.answer.findByIdAndUpdate(answerId, {
    $set: { comments: newComments }
  });

  // console.log(editedComment);

  return editedComment;
}

async function removeComment(
  { answerId, commentId }: GqlTypes.RemoveCommentMutationArgs,
  context: ApolloContext
): Promise<DbTypes.Comment> {
  const { models } = context;

  const answer = (await models.answer
    .findByIdAndUpdate(answerId, {
      $pull: {
        comments: { _id: ObjectId(commentId) }
      }
    })
    .populate("comments.user"))!.toObject();

  const { comments } = answer!;

  const removedComment = comments!.find(
    com => com._id.toString() === commentId
  );
  return removedComment!;
}

export const commentService = {
  addCommentToAnswer,
  editComment,
  removeComment
};
