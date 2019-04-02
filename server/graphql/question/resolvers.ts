import { mapQuestion, mapQuestions } from "./gqlMapper";
import { createConnection } from "../relayConnection/functions";
import { authMiddleware } from "../middlewares";
import { Types as GooseTypes } from "mongoose";
import { QueryResolvers, MutationResolvers } from "../autoGenTypes";

const { ObjectId } = GooseTypes;

type Query = Required<
  Pick<QueryResolvers, "questionsTags" | "questions" | "answeredQuestion">
>;

type Mutation = Required<
  Pick<MutationResolvers, "addQuestions" | "questionNotApply">
>;

const Query: Query = {
  async questions(
    root,
    { after, answered, first, tags, userId },
    { services, user }
  ) {
    authMiddleware(user);
    if (tags && tags.some(tag => tag === "")) {
      throw Error("tags cannot have empty strings");
    }
    if (tags && tags.length === 0) {
      throw Error("tags cannot have 0 elements");
    }
    if (!ObjectId.isValid(userId)) {
      throw new Error("userId invalid format");
    }

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
    authMiddleware(user);

    return await services.question.getAllTags();
  },

  async answeredQuestion(_, { userId, questionId }, { services, user }) {
    authMiddleware(user);

    const dbQuestion = await services.question.getQuestion(questionId);
    const dbAnswer = await services.answer.getUserAnswer(userId, questionId);
    const res = mapQuestion(user!.id, dbQuestion, dbAnswer);

    return res;
  }
};

const Mutation: Mutation = {
  async addQuestions(_, { questions }, { services, user }) {
    authMiddleware(user);

    return services.question.addQuestions(questions!) as any;
  },

  async questionNotApply(_, { questionId }, { services, user }) {
    authMiddleware(user);

    const dbQuestion = await services.question.markNotApply(
      questionId,
      user!.id
    );
    return mapQuestion(user!.id, dbQuestion);
  }
};

export { Query, Mutation };
