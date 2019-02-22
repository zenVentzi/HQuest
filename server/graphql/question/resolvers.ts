import { Query, Mutation } from "./types";
import { mapQuestion, mapQuestions } from "./gqlMapper";
import { questionService, answerService } from "../../services";
import { createConnection } from "../relayConnection/functions";

const Query: Query = {
  async questions(root, args, context) {
    const dbAnswers = await answerService.getUserAnswers(
      { userId: args.userId },
      context
    );

    const dbQuestions = await questionService.getUserQuestions(
      dbAnswers,
      args.answered,
      context,
      args.tags
    );

    const gqlQuestions = mapQuestions({
      dbQuestions,
      loggedUserId: context.user!.id
    });

    const connection = createConnection({ nodes: gqlQuestions, ...args });
    return connection;
  },
  async questionsTags(_, __, context) {
    return await questionService.getAllTags(context);
  },
  async answeredQuestion(_, { userId, questionId }, context) {
    const dbQuestion = await questionService.getQuestion(
      { questionId },
      context
    );
    const dbAnswer = await answerService.getUserAnswer(
      { userId, questionId },
      context
    );
    const res = mapQuestion(context.user!.id, dbQuestion, dbAnswer);

    return res;
  }
};

const Mutation: Mutation = {
  async addQuestions(_, { questions }, context) {
    return questionService.addQuestions({ questions }, context) as any;
  },

  async questionNotApply(_, args, context) {
    const dbQuestion = await questionService.markNotApply(args, context);
    return mapQuestion(context.user!.id, dbQuestion);
  }
};

export { Query, Mutation };
