import { Mutation } from "./types";
import { mapAnswer } from "./gqlMapper";
import { newsfeedService, answerService, userService } from "../../../services";

const Mutation: Mutation = {
  async editAnswer(_, args, context) {
    const dbAnswer = await answerService.edit(args, context);

    await newsfeedService.onEditAnswer(
      args.answerId,
      context.user!.id,
      context
    );

    return mapAnswer({ dbAnswer, loggedUserId: context.user!.id });
  },

  async addAnswer(_, args, context) {
    const dbAnswer = await answerService.add(args, context);

    await newsfeedService.onNewAnswer(
      dbAnswer._id.toHexString(),
      context.user!.id,
      context
    );

    return mapAnswer({ dbAnswer, loggedUserId: context.user!.id });
  },

  async removeAnswer(_, args, context) {
    const dbAnswer = await answerService.remove(args, context);

    return mapAnswer({ dbAnswer, loggedUserId: context.user!.id });
  },
  async likeAnswer(_, args, context) {
    const dbUserLiker = (await userService.getUser(
      { id: context.user!.id },
      context
    ))!;
    const dbAnswer = await answerService.like(
      { ...args, dbUserLiker },
      context
    );
    await newsfeedService.onLikeAnswer(dbAnswer, context.user!.id, context);
    return mapAnswer({ dbAnswer, loggedUserId: context.user!.id });
  },
  async moveAnswerPosition(_, args, context) {
    return answerService.movePosition(args, context);
  }
};

export { Mutation };
