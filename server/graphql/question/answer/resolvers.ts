import { Mutation } from "./types";
import { mapAnswer } from "./gqlMapper";
import { authMiddleware } from "../../middlewares";

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

  async likeAnswer(_, { answerId, userLikes }, { services, user }) {
    authMiddleware(user);

    const dbAnswer = await services.answer.like(answerId, user!.id, userLikes);
    await services.newsfeed.onLikeAnswer(dbAnswer, user!.id);
    return mapAnswer({ dbAnswer, loggedUserId: user!.id });
  },
  async moveAnswerPosition(_, { answerId, position }, { services, user }) {
    authMiddleware(user);

    return services.answer.movePosition(answerId, position);
  }
};

export { Mutation };
