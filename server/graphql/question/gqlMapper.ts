import { Question } from "../autoGenTypes";
import { Question as DbQuestion, Answer as DbAnswer } from "../../dbTypes";
import { mapAnswer } from "./answer/gqlMapper";

function mapQuestion(
  loggedUserId: string,
  dbQuestion: DbQuestion,
  dbAnswer?: DbAnswer
): Question {
  const gqlQuestion: Question = {
    id: dbQuestion._id.toString(),
    value: dbQuestion.value,
    tags: dbQuestion.tags
  };

  if (dbAnswer) {
    if (!dbAnswer.questionId.equals(dbQuestion._id)) {
      throw Error("Cannot map answer to question with wrong id");
    }

    gqlQuestion.answer = mapAnswer({
      dbAnswer,
      loggedUserId
    });
  }

  return gqlQuestion;
}

function mapQuestions({
  dbQuestions,
  loggedUserId
}: {
  dbQuestions: DbQuestion[] | null;
  loggedUserId: string;
}): Question[] | null {
  if (!dbQuestions) return null;
  return dbQuestions.map(dbQuestion => {
    return mapQuestion(loggedUserId, dbQuestion, dbQuestion.answer);
  });
}

export { mapQuestion, mapQuestions };
