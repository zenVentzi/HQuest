import { Mutation } from "./types";
import { mapComment, mapComments } from "./gqlMapper";
import {
  newsfeedService,
  answerService,
  notificationService,
  commentService
} from "../../../../services";

const Mutation: Mutation = {
  async commentAnswer(_, { answerId, comment }, context) {
    const dbAnswer = await answerService.getAnswerById(answerId, context);
    const dbComment = await commentService.addCommentToAnswer(
      {
        comment,
        answerId
      },
      context
    );

    if (!dbComment) throw Error("Failed to add comment");

    await newsfeedService.onNewComment(
      dbAnswer,
      dbComment._id.toString(),
      context.user!.id,
      context
    );
    await notificationService.newComment(
      {
        answerId,
        dbComment
      },
      context
    );

    return mapComment({
      dbComment,
      loggedUserId: context.user!.id
    });
  },

  async editComment(_, args, context) {
    const dbComment = await commentService.editComment(args, context);

    if (dbComment) {
      return mapComment({
        dbComment,
        loggedUserId: context.user!.id
      });
    }

    throw Error("Failed to edit comment");
  },

  async removeComment(_, args, context) {
    const dbComment = await commentService.removeComment(args, context);

    return mapComment({
      dbComment,
      loggedUserId: context.user!.id
    });
  }
};

export { Mutation };
