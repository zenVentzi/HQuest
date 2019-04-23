import * as gqlTypes from "../autoGenTypes";
import * as dbTypes from "../../dbTypes";
import { mapAnswer } from "./answer/gqlMapper";

function mapAnsweredQuestion(
  dbQuestion: dbTypes.AnsweredQuestion,
  loggedUserId: string
): gqlTypes.AnsweredQuestion {
  const gqlQuestion: gqlTypes.AnsweredQuestion = {
    id: dbQuestion._id.toString(),
    value: dbQuestion.value,
    tags: dbQuestion.tags,
    answer: mapAnswer({
      dbAnswer: dbQuestion.answer,
      loggedUserId
    })
  };

  return gqlQuestion;
}

function mapUnansweredQuestion(
  dbQuestion: dbTypes.UnansweredQuestion,
  loggedUserId: string
): gqlTypes.UnansweredQuestion {
  const gqlQuestion: gqlTypes.UnansweredQuestion = {
    id: dbQuestion._id.toString(),
    value: dbQuestion.value,
    tags: dbQuestion.tags
  };

  return gqlQuestion;
}

function mapAnsweredQuestions(
  dbQuestions: dbTypes.AnsweredQuestion[] | null,
  loggedUserId: string
): gqlTypes.AnsweredQuestion[] | null {
  if (!dbQuestions) return null;
  return dbQuestions.map(dbQuestion => {
    return mapAnsweredQuestion(dbQuestion, loggedUserId);
  });
}

function mapUnansweredQuestions(
  dbQuestions: dbTypes.UnansweredQuestion[] | null,
  loggedUserId: string
): gqlTypes.UnansweredQuestion[] | null {
  if (!dbQuestions) return null;
  return dbQuestions.map(dbQuestion => {
    return mapUnansweredQuestion(dbQuestion, loggedUserId);
  });
}

export {
  mapAnsweredQuestion,
  mapAnsweredQuestions,
  mapUnansweredQuestion,
  mapUnansweredQuestions
};
