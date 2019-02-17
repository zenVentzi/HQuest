import { Types as GooseTypes } from "mongoose";
import { AnswerModel } from "../../models/answer";
import { NewsfeedModel } from "../../models/newsfeed";
import { QuestionModel } from "../../models/question";
import { UserModel } from "../../models/user";
// import { deepFreeze } from "../../utils";

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

const tempContext: ApolloContext = {
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

  const actual = await mutations.login({}, args, tempContext, {} as any);

  expect(existingUser._id).toBeTruthy();
  expect(actual.userId).toEqual(existingUser._id.toString());
  expect(actual.authToken).toBeTruthy();
  done();
});

test("login() should register if user doesn't exist", async done => {
  const args = { email: "fdf", name: "fdf hh" };

  const actual = await mutations.login({}, args, tempContext, {} as any);

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

  const actual = await mutations.editUser({}, args, tempContext, {} as any);

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
    tempContext,
    {} as any
  );

  const actual = addedComment.value;
  const expected = "commentValue";
  expect(actual).toEqual(expected);
  done();
});

test("commentAnswer() should notify answer owner", async done => {
  await new UserModel(tempUser).save();

  const answerOwner = (await new UserModel({
    ...tempUser,
    _id: ObjectId()
  } as DbTypes.User).save()).toObject();

  const existingAnswer = (await new AnswerModel({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: answerOwner._id
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.CommentAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    comment: "commentValue"
  };
  const addedComment = await mutations.commentAnswer(
    {},
    args,
    tempContext,
    {} as any
  );

  const answerOwnerWithNotifications = (await UserModel.findById(
    answerOwner._id
  ))!.toObject();
  const actual = answerOwnerWithNotifications.notifications![0].commentId;
  const expected = addedComment.id;
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
    tempContext,
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
    tempContext,
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

  const addedAnswer = await mutations.addAnswer(
    {},
    args,
    tempContext,
    {} as any
  );
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
    tempContext,
    {} as any
  );

  const actual = removedAnswer.id;
  const expexted = args.answerId;
  expect(actual).toEqual(expexted);
  done();
});

test("editAnswer() should return edited answer", async done => {
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
  const editedAnswer = await mutations.editAnswer(
    {},
    args,
    tempContext,
    {} as any
  );
  const actual = editedAnswer.value;
  const expected = args.answerValue;
  expect(actual).toEqual(expected);
  done();
});

test("editAnswer() result should contain editions", async done => {
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
  const editedAnswer = await mutations.editAnswer(
    {},
    args,
    tempContext,
    {} as any
  );
  const actual = editedAnswer.editions!.length;
  const expected = 1;
  expect(actual).toEqual(expected);
  done();
});

test("likeAnswer() result should contain likes", async done => {
  await new UserModel(tempUser).save();
  const existingAnswer = (await new AnswerModel({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.LikeAnswerMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    userLikes: 5
  };
  const likedAnswer = await mutations.likeAnswer(
    {},
    args,
    tempContext,
    {} as any
  );
  const actual = likedAnswer.likes!.total;
  const expected = args.userLikes;
  expect(actual).toEqual(expected);
  done();
});

test("moveAnswerPosition() should return new position", async done => {
  // await new UserModel(tempUser).save();
  const existingAnswer = (await new AnswerModel({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId()
  } as DbTypes.Answer).save()).toObject();

  const args: GqlTypes.MoveAnswerPositionMutationArgs = {
    answerId: existingAnswer._id.toHexString(),
    position: 4
  };
  const newPosition = await mutations.moveAnswerPosition(
    {},
    args,
    tempContext,
    {} as any
  );
  const actual = newPosition;
  const expected = args.position;
  expect(actual).toEqual(expected);
  done();
});

test("follow() should add followers to user doc", async done => {
  const existingUser = (await new UserModel({
    email: "fdf@",
    firstName: "Pesho123",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.FollowMutationArgs = {
    follow: true,
    userId: existingUser._id.toHexString()
  };
  await mutations.follow({}, args, tempContext, {} as any);

  const updatedUser = (await UserModel.findById(existingUser._id))!.toObject();
  const actual = updatedUser.followers![0].toHexString();
  const expected = tempContext.user!.id;
  expect(actual).toEqual(expected);
  done();
});

test("follow(false) should remove followers from user doc", async done => {
  const existingUser = (await new UserModel({
    email: "fdf@",
    firstName: "Pesho123",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.FollowMutationArgs = {
    follow: true,
    userId: existingUser._id.toHexString()
  };
  await mutations.follow({}, args, tempContext, {} as any);
  await mutations.follow(
    {},
    { ...args, follow: false },
    tempContext,
    {} as any
  );

  const updatedUser = (await UserModel.findById(existingUser._id))!.toObject();
  const actual = updatedUser.followers;
  const expected = [] || undefined;
  expect(actual).toEqual(expected);
  done();
});

test("follow() should add notification to the followed user", async done => {
  const follower = (await new UserModel({
    email: "fdf@",
    firstName: "Pesho123",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save())!.toObject();

  const followedUser = (await new UserModel(tempUser).save())!.toObject();

  const args: GqlTypes.FollowMutationArgs = {
    follow: true,
    userId: followedUser._id.toHexString()
  };

  const followerContext = { ...tempContext };
  followerContext.user = {
    email: follower.email,
    id: follower._id.toHexString()
  };
  await mutations.follow({}, args, followerContext, {} as any);

  const followedUserUpdated = (await UserModel.findById(
    followedUser._id
  ))!.toObject();
  const actual = followedUserUpdated.notifications![0].seen;
  const expected = false;
  expect(actual).toEqual(expected);
  done();
});

test("notifsMarkSeen() should mark user notifications as seen", async done => {
  const follower = (await new UserModel({
    email: "fdf@",
    firstName: "Pesho123",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save())!.toObject();
  const followerContext = { ...tempContext };
  followerContext.user = {
    email: follower.email,
    id: follower._id.toHexString()
  };

  const followed = (await new UserModel(tempUser).save())!.toObject();
  const followedContext = tempContext;

  const args: GqlTypes.FollowMutationArgs = {
    follow: true,
    userId: followed._id.toHexString()
  };
  await mutations.follow({}, args, followerContext, {} as any);

  await mutations.notifsMarkSeen({}, {}, followedContext, {} as any);
  const followedUpdated = (await UserModel.findById(followed._id))!.toObject();

  const actual = followedUpdated.notifications![0].seen;
  const expected = true;
  expect(actual).toEqual(expected);
  done();
});
