import { Types as GooseTypes } from "mongoose";
import { AnswerModel } from "../models/answer";
import { NewsfeedModel } from "../models/newsfeed";
import { QuestionModel } from "../models/question";
import { UserModel } from "../models/user";
import { services } from "./index";

import * as DbTypes from "../dbTypes";
import { ApolloContext } from "../types/gqlContext";

const { ObjectId } = GooseTypes;
const { question: questionService } = services;

const contextUser = {
  _id: ObjectId("5c652bcbbe436f0108224888"),
  email: "fdf",
  firstName: "Pesho",
  surName: "Goeshev",
  intro: "blaIntro",
  avatarSrc: "test"
} as DbTypes.User;

const context: ApolloContext = {
  user: { email: contextUser.email, id: contextUser._id.toHexString() },
  services
};

test("getAnsweredQuestions() should return answered questions with tags", async done => {
  const questionId = ObjectId();
  const question: DbTypes.AnsweredQuestion = {
    _id: questionId,
    tags: ["tag1"],
    value: "question?",
    answer: {
      _id: ObjectId(),
      position: 1,
      userId: contextUser._id.toHexString(),
      questionId: questionId.toHexString(),
      editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
      // value: "answerVal"
    }
  };
  await new QuestionModel(question).save();
  await new AnswerModel(question.answer).save();
  const answeredQuestions = await questionService.getAnsweredQuestions(
    [question.answer],
    ["tag1"]
  );
  const actual = answeredQuestions[0].value;
  const expected = "question?";
  expect(actual).toEqual(expected);
  done();
});

test(`getAnsweredQuestions() should return no questions because questions
 with tag2 do not exist(insert stupid dab meme here)`, async done => {
  const questionId = ObjectId();
  const question: DbTypes.AnsweredQuestion = {
    _id: questionId,
    tags: ["tag1"],
    value: "question?",
    answer: {
      _id: ObjectId(),
      position: 1,
      userId: contextUser._id.toHexString(),
      questionId: questionId.toHexString(),
      editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
      // value: "answerVal"
    }
  };
  await new QuestionModel(question).save();
  await new AnswerModel(question.answer).save();
  const answeredQuestions = await questionService.getAnsweredQuestions(
    [question.answer],
    ["tag1", "tag2"]
  );
  const actual = answeredQuestions.length;
  const expected = 0;
  expect(actual).toEqual(expected);
  done();
});
