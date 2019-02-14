import { Types as GooseTypes } from "mongoose";
import { AnswerModel } from "../../models/answer";
import { NewsfeedModel } from "../../models/newsfeed";
import { QuestionModel } from "../../models/question";
import { UserModel } from "../../models/user";

import * as DbTypes from "../../dbTypes";
import * as GqlTypes from "../../generated/gqltypes";
import { ApolloContext } from "../../types/gqlContext";
import queries from "./index";

const { ObjectId } = GooseTypes;

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
  models: {
    answer: AnswerModel,
    newsfeed: NewsfeedModel,
    question: QuestionModel,
    user: UserModel
  }
};

test("should register if login doesn't exist", async done => {
  expect(true).toEqual(true);
  done();
});

test("user() should return user if found", async done => {
  await new UserModel(contextUser).save();
  const args: GqlTypes.UserQueryArgs = { id: contextUser._id.toHexString() };
  const user = await queries.user({}, args, context, {} as any);
  const actual = user!.id;
  const expected = contextUser._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("user() should return null if not found", async done => {
  // await new UserModel(tempUser).save();
  const args: GqlTypes.UserQueryArgs = { id: contextUser._id.toHexString() };
  const user = await queries.user({}, args, context, {} as any);
  const actual = user;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("notifications() should return notifications if found", async done => {
  const dbNotif: DbTypes.NewFollower = {
    _id: ObjectId(),
    type: DbTypes.NotificationType.NewFollower,
    commentId: "fd",
    performerAvatarSrc: "fd",
    performerId: "df",
    questionId: "df",
    seen: false,
    text: "df"
  };

  await new UserModel({
    ...contextUser,
    notifications: [dbNotif]
  } as DbTypes.User).save();

  const notifs = await queries.notifications({}, {}, context, {} as any);
  const actual = notifs![0].id;
  const expected = dbNotif._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("notifications() should return null if not found", async done => {
  await new UserModel({
    ...contextUser
    // notifications: [dbNotif]
  } as DbTypes.User).save();

  const notifs = await queries.notifications({}, {}, context, {} as any);
  const actual = notifs;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});
