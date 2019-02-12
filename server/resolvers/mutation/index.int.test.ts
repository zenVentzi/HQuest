import { Types as GooseTypes } from "mongoose";
import { AnswerModel } from "../../models/answer";
import { NewsfeedModel } from "../../models/newsfeed";
import { QuestionModel } from "../../models/question";
import { UserModel } from "../../models/user";

import * as DbTypes from "../../dbTypes";
import * as GqlTypes from "../../generated/gqltypes";
import { ApolloContext } from "../../types/gqlContext";
import mutations from "./index";

const { ObjectId } = GooseTypes;

const tempUser = {
  _id: ObjectId(),
  email: "fdf",
  firstName: "Pesho",
  surName: "Goeshev",
  intro: "blaIntro",
  avatarSrc: "test"
} as DbTypes.User;

const context: ApolloContext = {
  user: { email: tempUser.email, id: tempUser._id.toHexString() },
  models: {
    answer: AnswerModel,
    newsfeed: NewsfeedModel,
    question: QuestionModel,
    user: UserModel
  }
};

test("login() should login if user exists", async done => {
  const existingUser = await new UserModel({
    email: "fdf",
    firstName: "Pesho",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save();

  const args = {
    email: existingUser.email,
    name: [existingUser.firstName, existingUser.surName].join(" ")
  };

  const actual = await mutations.login({}, args, context, {} as any);

  expect(existingUser._id).toBeTruthy();
  expect(actual.userId).toEqual(existingUser._id.toString());
  expect(actual.authToken).toBeTruthy();
  done();
});

test("login() should register if user doesn't exist", async done => {
  const args = { email: "fdf", name: "fdf hh" };

  const actual = await mutations.login({}, args, context, {} as any);

  expect(actual.authToken).toBeTruthy();
  expect(actual.userId).toBeTruthy();
  done();
});

test("editUser() should edit existing user", async done => {
  const existingUser = (await new UserModel(tempUser).save()).toObject();

  const args: GqlTypes.EditUserMutationArgs = {
    input: {
      fullName: "Pesho Goshev1",
      intro: "fdf",
      socialMediaLinks: {
        facebookLink: "",
        instagramLink: "",
        linkedInLink: "",
        twitterLink: ""
      }
    }
  };

  const actual = await mutations.editUser({}, args, context, {} as any);

  expect(existingUser._id).toBeTruthy();
  expect(actual.fullName).toEqual(args.input!.fullName);
  expect(actual.intro).toEqual(args.input!.intro);
  done();
});

test("commentAnswer() should return added comment", async done => {
  await new UserModel(tempUser).save();

  const existingAnswer = (await new AnswerModel({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.CommentAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    comment: "commentValue"
  };
  const addedComment = await mutations.commentAnswer(
    {},
    args,
    context,
    {} as any
  );

  const actual = addedComment.value;
  const expected = "commentValue";
  expect(actual).toEqual(expected);
  done();
});

test("editComment() should return edited comment", async done => {
  const existingUser = (await new UserModel(tempUser).save()).toObject();

  const existingAnswer = (await new AnswerModel({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId(),
    comments: [
      { _id: ObjectId(), user: existingUser, value: "commentValue" }
    ] as DbTypes.Comment[]
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.EditCommentMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    commentId: existingAnswer.comments![0]._id.toHexString(),
    commentValue: "editedCommentValue"
  };

  const editedComment = await mutations.editComment(
    {},
    args,
    context,
    {} as any
  );

  const actual = editedComment.value;
  const expected = "editedCommentValue";
  expect(actual).toEqual(expected);
  done();
});

test("removeComment() should return removed comment", async done => {
  const existingUser = (await new UserModel(tempUser).save()).toObject();

  const existingAnswer = (await new AnswerModel({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId(),
    comments: [
      { _id: ObjectId(), user: existingUser, value: "commentValue" }
    ] as DbTypes.Comment[]
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.RemoveCommentMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    commentId: existingAnswer.comments![0]._id.toHexString()
  };

  const removedComment = await mutations.removeComment(
    {},
    args,
    context,
    {} as any
  );

  const actual = removedComment.id;
  const expected = existingAnswer.comments![0]._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("addAnswer() should return added answer", async done => {
  const args: GqlTypes.AddAnswerMutationArgs = {
    answerValue: "answerValue",
    questionId: ObjectId().toHexString()
  };

  const addedAnswer = await mutations.addAnswer({}, args, context, {} as any);
  const actual = addedAnswer.value;
  const expected = args.answerValue;
  expect(actual).toEqual(expected);
  done();
});

test("removeAnswer() should return removed answer", async done => {
  const existingAnswer = (await new AnswerModel({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.RemoveAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString()
  };
  const removedAnswer = await mutations.removeAnswer(
    {},
    args,
    context,
    {} as any
  );

  const actual = removedAnswer.id;
  const expexted = args.answerId;
  expect(actual).toEqual(expexted);
  done();
});

test.only("editAnswer() should return edited answer", async done => {
  const existingAnswer = (await new AnswerModel({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.EditAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerValue: "newAss brand new fuck ya fresh mirin"
  };
  const editedAnswer = await mutations.editAnswer({}, args, context, {} as any);
  const actual = editedAnswer.value;
  const expected = args.answerValue;
  expect(actual).toEqual(expected);
  done();
});
