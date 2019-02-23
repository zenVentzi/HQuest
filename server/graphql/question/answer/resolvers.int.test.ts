import { Types as GooseTypes } from "mongoose";
import { services } from "../../../services";
import { models } from "../../../models";
import { Mutation } from "./resolvers";

import * as DbTypes from "../../../dbTypes";
import * as GqlTypes from "../../../generated/gqltypes";
import { ApolloContext } from "../../../types/gqlContext";

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
  services
};

test("addAnswer() should return added answer", async done => {
  const args: GqlTypes.AddAnswerMutationArgs = {
    answerValue: "answerValue",
    questionId: ObjectId().toHexString()
  };

  const addedAnswer = await Mutation.addAnswer({}, args, context, {} as any);
  const actual = addedAnswer.value;
  const expected = args.answerValue;
  expect(actual).toEqual(expected);
  done();
});

test("removeAnswer() should return removed answer", async done => {
  const existingAnswer = (await new models.answer({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.RemoveAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString()
  };
  const removedAnswer = await Mutation.removeAnswer(
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

test("editAnswer() should return edited answer", async done => {
  const existingAnswer = (await new models.answer({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.EditAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerValue: "newAss brand new fuck ya fresh mirin"
  };
  const editedAnswer = await Mutation.editAnswer({}, args, context, {} as any);
  const actual = editedAnswer.value;
  const expected = args.answerValue;
  expect(actual).toEqual(expected);
  done();
});

test("editAnswer() result should contain editions", async done => {
  const existingAnswer = (await new models.answer({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.EditAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerValue: "newAss brand new fuck ya fresh mirin"
  };
  const editedAnswer = await Mutation.editAnswer({}, args, context, {} as any);
  const actual = editedAnswer.editions!.length;
  const expected = 1;
  expect(actual).toEqual(expected);
  done();
});

test("likeAnswer() result should contain likes", async done => {
  await new models.user(contextUser).save();
  const existingAnswer = (await new models.answer({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.LikeAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    userLikes: 5
  };
  const likedAnswer = await Mutation.likeAnswer({}, args, context, {} as any);
  const actual = likedAnswer.likes!.total;
  const expected = args.userLikes;
  expect(actual).toEqual(expected);
  done();
});

test("moveAnswerPosition() should return new position", async done => {
  // await new UserModel(contextUser).save();
  const existingAnswer = (await new models.answer({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.MoveAnswerPositionMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    position: 4
  };
  const newPosition = await Mutation.moveAnswerPosition(
    {},
    args,
    context,
    {} as any
  );
  const actual = newPosition;
  const expected = args.position;
  expect(actual).toEqual(expected);
  done();
});
