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
    questionId: ObjectId(),
    userId: ObjectId(),
    editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.CommentAnswerEditionMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerEditionId: existingAnswer.editions[0]._id.toHexString(),
    comment: "commentValue"
  };
  const addedComment = await Mutation.commentAnswerEdition(
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

test("commentAnswer() should notify answer owner", async done => {
  await new models.user(contextUser).save();

  const answerOwner = (await new models.user({
    ...contextUser,
    _id: ObjectId()
  } as DbTypes.User).save()).toObject();

  const existingAnswer = (await new models.answer({
    position: 1,
    // value: "ass",
    questionId: ObjectId(),
    userId: answerOwner._id,
    editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.CommentAnswerEditionMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerEditionId: existingAnswer.editions[0]._id.toHexString(),
    comment: "commentValue"
  };
  const addedComment = await Mutation.commentAnswerEdition(
    {},
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
    questionId: ObjectId(),
    userId: ObjectId(),
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

  const args: GqlTypes.EditCommentMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerEditionId: existingAnswer.editions[0]._id.toHexString(),
    commentId: existingAnswer.editions[0].comments![0]._id.toHexString(),
    commentValue: "editedCommentValue"
  };

  const editedComment = await Mutation.editComment(
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
  const existingUser = (await new models.user(contextUser).save()).toObject();

  const existingAnswer = (await new models.answer({
    position: 1,
    questionId: ObjectId(),
    userId: ObjectId(),
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

  const args: GqlTypes.RemoveCommentMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    answerEditionId: existingAnswer.editions[0]._id.toHexString(),
    commentId: existingAnswer.editions[0].comments![0]._id.toHexString()
  };

  const removedComment = await Mutation.removeComment(
    {},
    args,
    context,
    {} as any
  );

  const actual = removedComment.id;
  const expected = existingAnswer.editions[0].comments![0]._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});
