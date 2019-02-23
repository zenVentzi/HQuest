import { Mutation } from "./types";
import { mapComment, mapComments } from "./gqlMapper";

const Mutation: Mutation = {
  async commentAnswer(_, { answerId, comment }, { services, user }) {
    const dbAnswer = await services.answer.getAnswerById(answerId);
    const dbComment = await services.comment.addCommentToAnswer(
      user!.id,
      comment,
      answerId
    );

    if (!dbComment) throw Error("Failed to add comment");

    await services.newsfeed.onNewComment(
      dbAnswer,
      dbComment._id.toString(),
      user!.id
    );
    await services.notification.newComment(user!.id, answerId, dbComment);

    return mapComment({
      dbComment,
      loggedUserId: user!.id
    });
  },

  async editComment(
    _,
    { answerId, commentId, commentValue },
    { services, user }
  ) {
    const dbComment = await services.comment.editComment(
      answerId,
      commentId,
      commentValue
    );

    if (dbComment) {
      return mapComment({
        dbComment,
        loggedUserId: user!.id
      });
    }

    // this should happen inside the service
    throw Error("Failed to edit comment");
  },

  async removeComment(_, { answerId, commentId }, { services, user }) {
    const dbComment = await services.comment.removeComment(answerId, commentId);

    return mapComment({
      dbComment,
      loggedUserId: user!.id
    });
  }
};

export { Mutation };
