import { Query, Mutation } from "./types";
import { mapQuestion, mapQuestions } from "./gqlMapper";
import { createConnection } from "../relayConnection/functions";

const Query: Query = {
  async questions(
    root,
    { after, answered, first, tags, userId },
    { services, user }
  ) {
    const dbAnswers = await services.answer.getUserAnswers(userId);

    const dbQuestions = await services.question.getUserQuestions(
      userId,
      dbAnswers,
      answered,
      tags
    );

    const gqlQuestions = mapQuestions({
      dbQuestions,
      loggedUserId: user!.id
    });

    const connection = createConnection(gqlQuestions, first, after);
    return connection;
  },

  async questionsTags(_, __, { services, user }) {
    return await services.question.getAllTags();
  },

  async answeredQuestion(_, { userId, questionId }, { services, user }) {
    const dbQuestion = await services.question.getQuestion(questionId);
    const dbAnswer = await services.answer.getUserAnswer(userId, questionId);
    const res = mapQuestion(user!.id, dbQuestion, dbAnswer);

    return res;
  }
};

const Mutation: Mutation = {
  async addQuestions(_, { questions }, { services, user }) {
    return services.question.addQuestions(questions!) as any;
  },

  async questionNotApply(_, { questionId }, { services, user }) {
    const dbQuestion = await services.question.markNotApply(
      questionId,
      user!.id
    );
    return mapQuestion(user!.id, dbQuestion);
  }
};

export { Query, Mutation };
