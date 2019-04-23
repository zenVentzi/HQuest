import { Types } from "mongoose";
import * as dbTypes from "../../dbTypes";
import * as gqlTypes from "../autoGenTypes";
import {
  mapAnsweredQuestion,
  mapUnansweredQuestion,
  mapAnsweredQuestions,
  mapUnansweredQuestions
} from "./gqlMapper";
import { models } from "../../models";

const { ObjectId } = Types;

test("mapQuestion() should return question without answer", () => {
  const dbQuestion = new models.question({
    value: "haha?",
    tags: ["fasa"]
  } as dbTypes.UnansweredQuestion).toObject();

  const expected: gqlTypes.UnansweredQuestion = {
    id: dbQuestion._id.toString(),
    value: "haha?",
    tags: ["fasa"]
  };

  const actual = mapUnansweredQuestion(dbQuestion, "");

  expect(actual).toEqual(expected);
});

test("mapAnsweredQuestion() should return question with answer", () => {
  const questionId = ObjectId();
  const dbQuestion: dbTypes.AnsweredQuestion = {
    _id: questionId,
    value: "haha?",
    tags: ["fasa"],
    answer: {
      _id: ObjectId(),
      position: 1,
      questionId: questionId.toHexString(),
      userId: ObjectId().toHexString(),
      editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
    }
  };

  const expectedQ: gqlTypes.AnsweredQuestion = {
    id: dbQuestion._id.toString(),
    value: "haha?",
    tags: ["fasa"],
    answer: {
      id: dbQuestion.answer._id.toString(),
      position: dbQuestion.answer.position,
      questionId: dbQuestion.answer.questionId.toString(),
      userId: dbQuestion.answer.userId.toString(),
      editions: [
        {
          id: dbQuestion.answer.editions[0]._id.toHexString(),
          date: dbQuestion.answer.editions[0].date,
          value: dbQuestion.answer.editions[0].value,
          comments: null,
          likes: null
        }
      ]
    }
  };

  // const expectedA: gqlTypes.Answer = ;

  // expectedQ.answer = expectedA;

  const actual = mapAnsweredQuestion(dbQuestion, "");

  expect(actual).toEqual(expectedQ);
});
