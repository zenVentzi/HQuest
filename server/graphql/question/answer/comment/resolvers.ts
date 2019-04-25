import { mapComment, mapComments } from "./gqlMapper";
import { authMiddleware } from "../../../middlewares";
import { MutationResolvers } from "../../../autoGenTypes";

type Mutation = Required<
  Pick<
    MutationResolvers,
    "commentAnswerEdition" | "editComment" | "removeComment" | "likeComment"
  >
>;

const Mutation: Mutation = {
  async commentAnswerEdition(
    _,
    { answerId, answerEditionId, comment, mentionedUsers },
    { services, user }
  ) {
    authMiddleware(user);

    const dbAnswer = await services.answer.getAnswerById(answerId);
    const dbComment = await services.comment.commentAnswerEdition(
      user!.id,
      comment,
      answerId,
      answerEditionId
    );

    if (!dbComment) throw Error("Failed to add comment");

    await services.newsfeed.onNewComment(
      dbAnswer,
      answerEditionId,
      dbComment._id.toString(),
      user!.id
    );
    await services.notification.onNewComment(
      user!.id,
      answerId,
      answerEditionId,
      dbComment,
      mentionedUsers
    );

    return mapComment({
      dbComment,
      loggedUserId: user!.id
    });
  },

  async editComment(
    _,
    { answerId, answerEditionId, commentId, commentValue, mentionedUsers },
    { services, user }
  ) {
    authMiddleware(user);

    const dbComment = await services.comment.editComment(
      answerId,
      answerEditionId,
      commentId,
      commentValue
    );
    await services.notification.onCommentEdit(
      user!.id,
      answerId,
      answerEditionId,
      dbComment,
      mentionedUsers
    );

    return mapComment({
      dbComment,
      loggedUserId: user!.id
    });
  },

  async removeComment(
    _,
    { answerId, answerEditionId, commentId },
    { services, user }
  ) {
    authMiddleware(user);

    const dbComment = await services.comment.removeComment(
      answerId,
      answerEditionId,
      commentId
    );
    return mapComment({
      dbComment,
      loggedUserId: user!.id
    });
  },

  async likeComment(
    _,
    { answerId, answerEditionId, commentId, userLikes },
    { services, user }
  ) {
    authMiddleware(user);

    const likedComment = await services.comment.likeComment(
      answerId,
      answerEditionId,
      commentId,
      user!.id,
      userLikes
    );
    const likedGqlComment = mapComment({
      dbComment: likedComment,
      loggedUserId: user!.id
    });
    const attempt_to_suck_own_dick_for_likes_and_exp =
      user!.id === likedGqlComment.user.id;

    if (!attempt_to_suck_own_dick_for_likes_and_exp) {
      await services.newsfeed.onLikeComment(
        await services.answer.getAnswerById(answerId),
        answerEditionId,
        likedComment._id.toHexString(),
        user!.id
      );
      const expForLikedComment = 1;

      await services.notification.onCommentLike(
        likedComment,
        answerId,
        answerEditionId,
        user!.id,
        expForLikedComment
      );
      await services.user.addExperience(
        expForLikedComment,
        likedGqlComment.user.id
      );
    }
    return likedGqlComment;
  }
};

export { Mutation };
