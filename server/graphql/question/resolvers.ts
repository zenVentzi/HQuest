import {
  mapAnsweredQuestion,
  mapAnsweredQuestions,
  mapUnansweredQuestion,
  mapUnansweredQuestions
} from "./gqlMapper";
import * as DbTypes from "../../dbTypes";
import { createConnection } from "../relayConnection/functions";
import { authMiddleware } from "../middlewares";
import { Types as GooseTypes } from "mongoose";
import { QueryResolvers, MutationResolvers } from "../autoGenTypes";

const { ObjectId } = GooseTypes;

type Query = Required<
  Pick<
    QueryResolvers,
    | "questionsTags"
    | "answeredQuestion"
    | "answeredQuestions"
    | "unansweredQuestions"
  >
>;

type Mutation = Required<
  Pick<MutationResolvers, "addQuestions" | "questionNotApply">
>;

// const questions = async (
//   root,
//   { after, answered, first, tags, userId },
//   { services, user }
// ) => {

// };

const Query: Query = {
  async answeredQuestions(
    root,
    { after, first, tags, userId },
    { services, user }
  ) {
    authMiddleware(user);
    if (tags && tags.some(tag => tag === "")) {
      throw Error("tags cannot have empty strings");
    }
    // if (tags && tags.length === 0) {
    //   throw Error("tags cannot have 0 elements");
    // }
    if (!ObjectId.isValid(userId)) {
      throw new Error("userId invalid format");
    }

    const dbAnswers = await services.answer.getUserAnswers(userId);
    const dbQuestions = await services.question.getAnsweredQuestions(
      dbAnswers,
      tags
    );

    const gqlQuestions = mapAnsweredQuestions(dbQuestions, user!.id);

    const connection = createConnection(gqlQuestions, first, after);
    return connection;
  },
  async unansweredQuestions(
    root,
    { after, first, tags, userId },
    { services, user }
  ) {
    authMiddleware(user);
    if (tags && tags.some(tag => tag === "")) {
      throw Error("tags cannot have empty strings");
    }
    // if (tags && tags.length === 0) {
    //   throw Error("tags cannot have 0 elements");
    // }
    if (!ObjectId.isValid(userId)) {
      throw new Error("userId invalid format");
    }

    const dbAnswers = await services.answer.getUserAnswers(userId);
    const dbQuestions = await services.question.getUnansweredQuestions(
      userId,
      dbAnswers.map(a => a.questionId),
      tags
    );

    const gqlQuestions = mapUnansweredQuestions(dbQuestions, user!.id);

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
    if (!dbAnswer) return null;
    const answeredQuestion: DbTypes.AnsweredQuestion = {
      ...dbQuestion,
      answer: dbAnswer
    };
    const gqlQuestion = mapAnsweredQuestion(answeredQuestion, user!.id);
    return gqlQuestion;
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
    return mapUnansweredQuestion(dbQuestion, user!.id);
  }
};

export { Query, Mutation };
