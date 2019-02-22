import { ApolloContext } from "gqlContext";
import { Resolver } from "../global/types";
import { Answer } from "./answer/types";
import { Connection } from "../relayConnection/types";

export interface Question {
  id: string;

  tags?: string[] | null;

  value: string;

  answer?: Answer | null;
}

interface AnsweredQuestionArgs {
  userId: string;

  questionId: string;
}

interface QuestionsArgs {
  answered: boolean;

  userId: string;

  tags?: string[] | null;

  first: number;

  after?: string | null;
}

interface QuestionConnection extends Connection<Question> {}

export interface Query {
  questionsTags: Resolver<{}, {}, ApolloContext, string[]>;
  questions: Resolver<
    {},
    QuestionsArgs,
    ApolloContext,
    QuestionConnection | null
  >;
  answeredQuestion: Resolver<{}, AnsweredQuestionArgs, ApolloContext, Question>;
}

interface InputQuestion {
  value: string;
  tags: string[];
}

interface AddQuestionsArgs {
  questions?: InputQuestion[] | null;
}

interface RemoveQuestionArgs {
  questionId: string;
}

interface QuestionNotApplyArgs {
  questionId: string;
}

export interface Mutation {
  addQuestions: Resolver<{}, AddQuestionsArgs, ApolloContext, boolean | null>;
  // removeQuestion: Resolver<{}, RemoveQuestionArgs, ApolloContext, Question>;
  questionNotApply: Resolver<{}, QuestionNotApplyArgs, ApolloContext, Question>;
}
