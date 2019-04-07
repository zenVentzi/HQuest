import { Types as GooseTypes } from "mongoose";
import { services } from "../../../../services";
import { models } from "../../../../models";
import { Mutation } from "./resolvers";

import * as DbTypes from "../../../../dbTypes";
import * as GqlTypes from "../../../autoGenTypes";
import { ApolloContext } from "../../../../types/gqlContext";

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

test("commentAnswer() should return added comment", async done => {
  await new models.user(contextUser).save();

  const existingAnswer = (await new models.answer({
    _id: ObjectId(),
    position: 1,
    questionId: ObjectId().toHexString(),
    userId: ObjectId().toHexString(),
    editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.MutationCommentAnswerEditionArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerEditionId: existingAnswer.editions[0]._id.toHexString(),
    comment: "commentValue"
  };

  if (typeof Mutation.commentAnswerEdition !== "function") {
    throw Error(`commentANswerEdition must be a function`);
  }
  const addedComment = await Mutation.commentAnswerEdition(
    {} as any,
    args,
    context,
    {} as any
  );

  const actual = addedComment.value;
  const expected = "commentValue";
  expect(actual).toEqual(expected);
  done();
});

test("commentAnswer() should notify answer owner", async done => {
  await new models.user(contextUser).save();

  const answerOwner = (await new models.user({
    ...contextUser,
    _id: ObjectId()
  } as DbTypes.User).save()).toObject();

  const existingAnswer = (await new models.answer({
    position: 1,
    // value: "ass",
    questionId: ObjectId().toHexString(),
    userId: answerOwner._id.toHexString(),
    editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.MutationCommentAnswerEditionArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerEditionId: existingAnswer.editions[0]._id.toHexString(),
    comment: "commentValue"
  };

  if (typeof Mutation.commentAnswerEdition !== "function") {
    throw Error(`commentANswerEdition must be a function`);
  }
  const addedComment = await Mutation.commentAnswerEdition(
    {} as any,
    args,
    context,
    {} as any
  );

  const answerOwnerWithNotifications = (await models.user.findById(
    answerOwner._id
  ))!.toObject();
  const actual = answerOwnerWithNotifications.notifications![0].commentId;
  const expected = addedComment.id;
  expect(actual).toEqual(expected);
  done();
});

test("editComment() should return edited comment", async done => {
  const existingUser = (await new models.user(contextUser).save()).toObject();

  const existingAnswer = (await new models.answer({
    position: 1,
    questionId: ObjectId().toHexString(),
    userId: ObjectId().toHexString(),
    editions: [
      {
        _id: ObjectId(),
        date: new Date(),
        value: "ass",
        comments: [
          { _id: ObjectId(), user: existingUser, value: "commentValue" }
        ] as DbTypes.Comment[]
      }
    ]
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.MutationEditCommentArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerEditionId: existingAnswer.editions[0]._id.toHexString(),
    commentId: existingAnswer.editions[0].comments![0]._id.toHexString(),
    commentValue: "editedCommentValue"
  };

  if (typeof Mutation.editComment !== "function") {
    throw Error(`editComment must be a function`);
  }

  const editedComment = await Mutation.editComment(
    {} as any,
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
  const existingUser = (await new models.user(contextUser).save()).toObject();

  const existingAnswer = (await new models.answer({
    position: 1,
    questionId: ObjectId().toHexString(),
    userId: ObjectId().toHexString(),
    editions: [
      {
        _id: ObjectId(),
        date: new Date(),
        value: "ass",
        comments: [
          { _id: ObjectId(), user: existingUser, value: "commentValue" }
        ] as DbTypes.Comment[]
      }
    ]
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.MutationRemoveCommentArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerEditionId: existingAnswer.editions[0]._id.toHexString(),
    commentId: existingAnswer.editions[0].comments![0]._id.toHexString()
  };

  if (typeof Mutation.removeComment !== "function") {
    throw Error(`removeComment must be a function`);
  }
  const removedComment = await Mutation.removeComment(
    {} as any,
    args,
    context,
    {} as any
  );

  const actual = removedComment.id;
  const expected = existingAnswer.editions[0].comments![0]._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});
