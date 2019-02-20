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

test("users() should return users that match 1 word", async done => {
  const user = await new UserModel(contextUser).save();
  const user1 = await new UserModel({
    ...contextUser,
    firstName: "hasan", // kade si we hasane auf england where are you hasane
    _id: ObjectId()
  } as DbTypes.User).save();
  const args: GqlTypes.UsersQueryArgs = { match: "hasan" };
  const users = await queries.users({}, args, context, {} as any);
  const actual = users![0].fullName;
  const expected = "hasan" + " " + contextUser.surName;
  expect(actual).toEqual(expected);
  done();
});

test("users() should return users that match 2 words", async done => {
  const user = await new UserModel(contextUser).save();
  const user1 = await new UserModel({
    ...contextUser,
    firstName: "hasan", // kade si we hasane auf england where are you hasane
    _id: ObjectId()
  } as DbTypes.User).save();
  const args: GqlTypes.UsersQueryArgs = {
    match: `hasan ${contextUser.surName}`
  };
  const users = await queries.users({}, args, context, {} as any);
  const actual = users![0].fullName;
  const expected = "hasan" + " " + contextUser.surName;
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

test("followers() should return followers if user has followers", async done => {
  const follower = (await new UserModel({
    ...contextUser,
    _id: ObjectId()
  } as DbTypes.User).save())!.toObject();

  const followed = (await new UserModel({
    ...contextUser,
    followers: [follower._id]
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.FollowersQueryArgs = {
    userId: followed._id.toHexString()
  };
  const followers = await queries.followers({}, args, context, {} as any);
  const actual = followers![0].id;
  const expected = follower._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("followers() should return null if user has no followers", async done => {
  // const follower = (await new UserModel({
  //   ...contextUser,
  //   _id: ObjectId()
  // } as DbTypes.User).save())!.toObject();

  const userWithoutFollowers = (await new UserModel({
    ...contextUser
    // followers: [follower._id]
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.FollowersQueryArgs = {
    userId: userWithoutFollowers._id.toHexString()
  };
  const followers = await queries.followers({}, args, context, {} as any);
  const actual = followers;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("followers() should return null if user is not found", async done => {
  const randomId = ObjectId().toHexString();
  const args: GqlTypes.FollowersQueryArgs = {
    userId: randomId
  };
  const followers = await queries.followers({}, args, context, {} as any);
  const actual = followers;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("following() should return following if user follows somebody", async done => {
  const randomUser = (await new UserModel({
    ...contextUser,
    _id: ObjectId()
  } as DbTypes.User).save())!.toObject();

  const user = (await new UserModel({
    ...contextUser,
    following: [randomUser._id]
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.FollowersQueryArgs = {
    userId: user._id.toHexString()
  };
  const following = await queries.following({}, args, context, {} as any);
  const actual = following![0].id;
  const expected = randomUser._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("following() should return nullshit if user doesn't follow anyone", async done => {
  const user = (await new UserModel({
    ...contextUser
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.FollowersQueryArgs = {
    userId: user._id.toHexString()
  };
  const following = await queries.following({}, args, context, {} as any);
  const actual = following;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("following() should return nullshit if user doesn't exist", async done => {
  const randomId = ObjectId().toHexString();

  const args: GqlTypes.FollowersQueryArgs = {
    userId: randomId
  };
  const following = await queries.following({}, args, context, {} as any);
  const actual = following;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

// tslint:disable-next-line: variable-name
test("questions() should return total number of questions", async ____done____SERIOUSLY____DONE => {
  const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
  const question1 = {
    _id: ObjectId(),
    tags: ["bla", "shegichka_we_bonak_hihi"],
    value: "questionValue1"
  };
  await new QuestionModel(question).save();
  await new QuestionModel(question1).save();
  await new UserModel(contextUser).save();

  const args: GqlTypes.QuestionsQueryArgs = {
    userId: contextUser._id.toHexString(),
    answered: false,
    first: 5
  };
  const questions = await queries.questions({}, args, context, {} as any);
  const actual = questions!.totalCount;
  const expected = 2;
  expect(actual).toEqual(expected);
  ____done____SERIOUSLY____DONE();
});

// tslint:disable-next-line: variable-name
test("questions() should return correct page info", async __just_a_little_bit_more_and_DONE => {
  const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
  const question1 = {
    _id: ObjectId(),
    tags: ["bla", "shegichka_we_bonak_hihi"],
    value: "questionValue1"
  };
  await new QuestionModel(question).save();
  await new QuestionModel(question1).save();
  await new UserModel(contextUser).save();
  const questions = await queries.questions(
    {},
    {
      userId: contextUser._id.toHexString(),
      answered: false,
      first: 5
    },
    context,
    {} as any
  );

  expect(questions!.totalCount).toEqual(2);
  expect(questions!.pageInfo.startCursor).toEqual(questions!.edges![0].cursor);
  expect(questions!.pageInfo.endCursor).toEqual(questions!.edges![1].cursor);
  expect(questions!.pageInfo.hasNextPage).toEqual(false);
  expect(questions!.pageInfo.hasPreviousPage).toEqual(false);
  __just_a_little_bit_more_and_DONE();
});

test("questions() return pageInfo hasNextPage=true", async done => {
  const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
  const question1 = {
    _id: ObjectId(),
    tags: ["bla", "shegichka_we_bonak_hihi"],
    value: "questionValue1"
  };
  await new QuestionModel(question).save();
  await new QuestionModel(question1).save();
  await new UserModel(contextUser).save();
  const questions = await queries.questions(
    {},
    {
      userId: contextUser._id.toHexString(),
      answered: false,
      first: 1
    },
    context,
    {} as any
  );

  expect(questions!.totalCount).toEqual(2);
  expect(questions!.pageInfo.startCursor).toEqual(questions!.edges![0].cursor);
  expect(questions!.pageInfo.endCursor).toEqual(questions!.edges![0].cursor);
  expect(questions!.pageInfo.hasNextPage).toEqual(true);
  expect(questions!.pageInfo.hasPreviousPage).toEqual(false);
  done();
});

test("questions() return pageInfo hasPreviousPage=true hasNextPage=false", async done => {
  const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
  const question1 = {
    _id: ObjectId(),
    tags: ["bla", "shegichka_we_bonak_hihi"],
    value: "questionValue1"
  };
  await new QuestionModel(question).save();
  await new QuestionModel(question1).save();
  await new UserModel(contextUser).save();
  const questionsFirstFetch = await queries.questions(
    {},
    {
      userId: contextUser._id.toHexString(),
      answered: false,
      first: 1
    },
    context,
    {} as any
  );

  const questionsSecondFetch = await queries.questions(
    {},
    {
      userId: contextUser._id.toHexString(),
      answered: false,
      first: 1,
      after: questionsFirstFetch!.pageInfo.endCursor
    },
    context,
    {} as any
  );

  expect(questionsSecondFetch!.totalCount).toEqual(2);
  expect(questionsSecondFetch!.pageInfo.startCursor).toEqual(
    questionsSecondFetch!.edges![0].cursor
  );
  expect(questionsSecondFetch!.pageInfo.endCursor).toEqual(
    questionsSecondFetch!.edges![0].cursor
  );
  expect(questionsSecondFetch!.pageInfo.hasNextPage).toEqual(false);
  expect(questionsSecondFetch!.pageInfo.hasPreviousPage).toEqual(true);
  done();
});

// tslint:disable-next-line: variable-name
test("questions() should return total number of questions", async ____done____SERIOUSLY____DONE => {
  const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
  const question1 = {
    _id: ObjectId(),
    tags: ["bla", "shegichka_we_bonak_hihi"],
    value: "questionValue1"
  };
  await new QuestionModel(question).save();
  await new QuestionModel(question1).save();
  await new UserModel(contextUser).save();
  const questionsFirstFetch = await queries.questions(
    {},
    {
      userId: contextUser._id.toHexString(),
      answered: false,
      first: 5
    },
    context,
    {} as any
  );

  const questionsSecondFetch = await queries.questions(
    {},
    {
      userId: contextUser._id.toHexString(),
      answered: false,
      first: 5,
      after: questionsFirstFetch!.pageInfo.startCursor
    },
    context,
    {} as any
  );
  const actual = questionsSecondFetch!.edges!.length;
  const expected = 1;
  expect(actual).toEqual(expected);
  ____done____SERIOUSLY____DONE();
});

test("questionsTags() should return all tags", async notDONEyet => {
  const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
  const question1 = {
    _id: ObjectId(),
    tags: ["bla1", "shegichka_we_bonak_hihi"],
    value: "questionValue1"
  };
  await new QuestionModel(question).save();
  await new QuestionModel(question1).save();
  await new UserModel(contextUser).save();

  const allTags = await queries.questionsTags({}, {}, context, {} as any);
  // console.log(allTags);
  expect(allTags).toContain("bla");
  expect(allTags).toContain("bla1");
  expect(allTags).toContain("shegichka_we_bonak_hihi");
  notDONEyet();
});

test("answeredQuestion() should return answered question", async done => {
  const question = { _id: ObjectId(), tags: ["bla"], value: "questionValue" };
  await new QuestionModel(question).save();
  await new UserModel(contextUser).save();
  const answer: DbTypes.Answer = {
    _id: ObjectId(),
    userId: contextUser._id,
    position: 1,
    questionId: question._id,
    value: "answerValue"
  };
  await new AnswerModel(answer).save();

  const answeredQuestion = await queries.answeredQuestion(
    {},
    {
      questionId: question._id.toHexString(),
      userId: contextUser._id.toHexString()
    },
    context,
    {} as any
  );
  expect(answeredQuestion.value).toEqual(question.value);
  expect(answeredQuestion.answer!.value).toEqual(answer.value);
  done();
});

test("newsfeed() should return newsfeed", async done => {
  const performer = (await new UserModel({
    ...contextUser,
    _id: ObjectId()
  } as DbTypes.User).save()).toObject();

  await new UserModel({
    ...contextUser,
    following: [performer._id]
  } as DbTypes.User).save();

  const questionDb = (await new QuestionModel({
    _id: ObjectId(),
    value: "hahaQuestion",
    tags: ["tag1"]
  } as DbTypes.Question).save()).toObject();

  const answerDb = (await new AnswerModel({
    _id: ObjectId(),
    position: 1,
    questionId: questionDb._id,
    userId: contextUser._id,
    value: "answerrrValue"
  } as DbTypes.Answer).save()).toObject();

  // new NewsfeedModel.save suddenly decided that it's not gonna work. Cool.
  await NewsfeedModel.create({
    _id: ObjectId(),
    answerId: answerDb._id.toHexString(),
    answerOwnerId: answerDb.userId.toHexString(),
    performerId: performer._id.toHexString(),
    type: DbTypes.NewsType.NewAnswer
  } as DbTypes.AnswerNews);
  // const newsfeed = (await NewsfeedModel.find().lean()) as DbTypes.Newsfeed;
  const newsfeed = await queries.newsfeed({}, {}, context, {} as any);
  const actual = newsfeed!.length;
  const expected = 1;
  expect(actual).toEqual(expected);
  done();
});
