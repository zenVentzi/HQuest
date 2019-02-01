import { AnswerModel } from "../../models/answer";
import { NewsfeedModel } from "../../models/newsfeed";
import { QuestionModel } from "../../models/question";
import { UserModel } from "../../models/user";

import { LoginResult } from "../../generated/gqltypes";
import { ApolloContext } from "../../types/index";
import mutations from "./index";

import * as DbTypes from "../../dbTypes";

const context: ApolloContext = {
  user: { email: "ff", id: "5c08b7766f91b01640e54921" }
};

test("should login if user exists", async done => {
  const user: DbTypes.User = {
    email: "fdf",
    firstName: "Pesho",
    surName: "Goeshev",
    avatarSrc: "test"
  };

  const existingUser = await new UserModel(user).save();

  const args = {
    email: user.email,
    name: [user.firstName, user.surName].join(" ")
  };

  const actual = await mutations.login({}, args, context, {} as any);

  expect(existingUser._id).toBeTruthy();
  expect(actual.userId).toEqual(existingUser._id.toString());
  expect(actual.authToken).toBeTruthy();
  expect(actual.userId).toBeTruthy();
  done();
});

test("should register if user doesn't exist", async done => {
  const args = { email: "fdf", name: "fdf hh" };

  const actual = await mutations.login({}, args, context, {} as any);
  // const expected: LoginResult = { email: "fdf", name: "John Cena" };

  // for (const key of Object.keys(expected)) {
  //   expect(actual[key]).toEqual(expected[key]);
  // }
  expect(actual.authToken).toBeTruthy();
  expect(actual.userId).toBeTruthy();
  done();
});
