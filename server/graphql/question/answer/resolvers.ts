import { mapAnswer, mapAnswerEditions, mapAnswerEdition } from "./gqlMapper";
import { authMiddleware } from "../../middlewares";
import { MutationResolvers } from "../../autoGenTypes";

interface Mutation {
  editAnswer: MutationResolvers.EditAnswerResolver;
  addAnswer: MutationResolvers.AddAnswerResolver;
  removeAnswer: MutationResolvers.RemoveAnswerResolver;
  likeAnswerEdition: MutationResolvers.LikeAnswerEditionResolver;
  moveAnswerPosition: MutationResolvers.MoveAnswerPositionResolver;
}

const Mutation: Mutation = {
  async editAnswer(_, { answerId, answerValue }, { services, user }) {
    authMiddleware(user);

    const dbAnswer = await services.answer.edit(answerId, answerValue);
    await services.newsfeed.onEditAnswer(answerId, user!.id);
    return mapAnswer({ dbAnswer, loggedUserId: user!.id });
  },

  async addAnswer(_, { answerValue, questionId }, { services, user }) {
    authMiddleware(user);

    const dbAnswer = await services.answer.add(
      user!.id,
      questionId,
      answerValue
    );

    await services.newsfeed.onNewAnswer(dbAnswer._id.toHexString(), user!.id);
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
    // FIXME  newsfeed
    // await services.newsfeed.onLikeAnswer(dbAnswer, user!.id);
    return mapAnswerEdition(dbEdition, user!.id);
  },
  async moveAnswerPosition(_, { answerId, position }, { services, user }) {
    authMiddleware(user);

    return services.answer.movePosition(answerId, position);
  }
};

export { Mutation };
