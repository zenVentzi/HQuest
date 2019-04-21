import { mapAnswer, mapAnswerEditions, mapAnswerEdition } from "./gqlMapper";
import { authMiddleware } from "../../middlewares";
import { MutationResolvers } from "../../autoGenTypes";

type Mutation = Required<
  Pick<
    MutationResolvers,
    | "editAnswer"
    | "addAnswer"
    | "removeAnswer"
    | "likeAnswerEdition"
    | "moveAnswerPosition"
  >
>;

const Mutation: Mutation = {
  async editAnswer(
    _,
    { answerId, answerValue, mentionedUsers },
    { services, user }
  ) {
    authMiddleware(user);

    const dbAnswer = await services.answer.edit(answerId, answerValue);
    await services.newsfeed.onEditAnswer(answerId, user!.id);
    await services.notification.onNewAnswerEdition(
      dbAnswer,
      user!.id,
      mentionedUsers
    );
    return mapAnswer({ dbAnswer, loggedUserId: user!.id });
  },

  async addAnswer(
    _,
    { answerValue, questionId, mentionedUsers },
    { services, user }
  ) {
    authMiddleware(user);

    const dbAnswer = await services.answer.add(
      user!.id,
      questionId,
      answerValue
    );

    await services.newsfeed.onNewAnswer(dbAnswer._id.toHexString(), user!.id);
    await services.notification.onNewAnswerEdition(
      dbAnswer,
      user!.id,
      mentionedUsers
    );
    return mapAnswer({ dbAnswer, loggedUserId: user!.id });
  },

  async removeAnswer(_, { answerId }, { services, user }) {
    authMiddleware(user);

    const dbAnswer = await services.answer.remove(answerId);
    return mapAnswer({ dbAnswer, loggedUserId: user!.id });
  },

  async likeAnswerEdition(
    _,
    { answerId, answerEditionId: editionId, userLikes },
    { services, user }
  ) {
    authMiddleware(user);

    const dbEdition = await services.answer.like(
      answerId,
      editionId,
      user!.id,
      userLikes
    );
    const answer = await services.answer.getAnswerById(answerId);
    const editionOwnerId = answer.userId;
    const attempt_to_suck_own_dick_for_likes_and_exp =
      user!.id === editionOwnerId;

    if (!attempt_to_suck_own_dick_for_likes_and_exp) {
      // FIXME  newsfeed
      // await services.newsfeed.onLikeAnswer(dbAnswer, user!.id);
      await services.notification.onEditionLike(answer, editionId, user!.id);
      await services.user.addExperience(2, editionOwnerId);
    }
    return mapAnswerEdition(dbEdition, user!.id);
  },
  async moveAnswerPosition(_, { answerId, position }, { services, user }) {
    authMiddleware(user);

    return services.answer.movePosition(answerId, position);
  }
};

export { Mutation };
