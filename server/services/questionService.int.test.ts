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
  const question = (await new QuestionModel({
    tags: ["tag1"],
    value: "question?"
  } as DbTypes.Question).save()).toObject();
  const answer = (await new AnswerModel({
    position: 1,
    userId: contextUser._id.toHexString(),
    questionId: question._id.toHexString(),
    editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
    // value: "answerVal"
  } as DbTypes.Answer).save()).toObject();
  const answeredQuestions = await questionService.getUserQuestions(
    context.user!.id,
    [answer],
    true,
    ["tag1", "tag2"]
  );
  const actual = answeredQuestions[0].value;
  const expected = "question?";
  expect(actual).toEqual(expected);
  done();
});
