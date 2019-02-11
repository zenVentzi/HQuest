import equal from "deep-equal";
import { Types } from "mongoose";
import * as dbTypes from "./dbTypes";
import * as gqlTypes from "./generated/gqltypes";
import { gqlMapper } from "./gqlMapper";
import { AnswerModel } from "./models/answer";
import { QuestionModel } from "./models/question";
import { UserModel } from "./models/user";

const { ObjectId } = Types;

describe("users", () => {
  test("map user without following/followers", async () => {
    const dbUser = new UserModel({
      firstName: "Pesho",
      surName: "Goshev",
      email: "bla@",
      intro: "introo",
      avatarSrc: "blaSrc"
    }).toObject();

    const expected: gqlTypes.User = {
      id: dbUser._id.toString(),
      fullName: "Pesho Goshev",
      intro: "introo",
      me: true,
      email: "bla@",
      avatarSrc: "blaSrc"
    };

    const actual = gqlMapper.getUser({
      dbUser,
      loggedUserId: dbUser._id.toString()
    });

    expect(actual).toEqual(expected);
  });

  test("map user with following/followers", async () => {
    const dbUser = new UserModel({
      firstName: "Pesho",
      surName: "Goshev",
      email: "bla@",
      intro: "introo",
      avatarSrc: "blaSrc",
      followers: [ObjectId(), ObjectId()],
      following: [ObjectId(), ObjectId()]
    }).toObject();

    const expected: gqlTypes.User = {
      id: dbUser._id.toString(),
      fullName: "Pesho Goshev",
      intro: "introo",
      me: true,
      email: "bla@",
      avatarSrc: "blaSrc",
      followers: dbUser.followers!.map(f => f.toString()),
      following: dbUser.following!.map(f => f.toString())
    };

    const actual = gqlMapper.getUser({
      dbUser,
      loggedUserId: dbUser._id.toString()
    });

    expect(actual).toEqual(expected);
  });
  test("map users", async () => {
    const dbUser1 = new UserModel({
      firstName: "Pesho",
      surName: "Goshev",
      email: "bla@",
      intro: "introo",
      avatarSrc: "blaSrc",
      followers: [ObjectId(), ObjectId()],
      following: [ObjectId(), ObjectId()]
    }).toObject();

    const dbUser2 = new UserModel({
      firstName: "Pesho1",
      surName: "Goshev",
      email: "bla@",
      intro: "introo",
      avatarSrc: "blaSrc",
      followers: [ObjectId(), ObjectId()],
      following: [ObjectId(), ObjectId()]
    }).toObject();

    const dbUsers = [dbUser1, dbUser2];

    const expected1: gqlTypes.User = {
      id: dbUser1._id.toString(),
      fullName: "Pesho Goshev",
      intro: "introo",
      me: true,
      email: "bla@",
      avatarSrc: "blaSrc",
      followers: dbUser1.followers!.map(f => f.toString()),
      following: dbUser1.following!.map(f => f.toString())
    };

    const expected2: gqlTypes.User = {
      id: dbUser2._id.toString(),
      fullName: "Pesho1 Goshev",
      intro: "introo",
      me: false,
      email: "bla@",
      avatarSrc: "blaSrc",
      followers: dbUser2.followers!.map(f => f.toString()),
      following: dbUser2.following!.map(f => f.toString())
    };

    const expected = [expected1, expected2];

    const actual = gqlMapper.getUsers({
      dbUsers,
      loggedUserId: dbUser1._id.toString()
    });

    expect(actual).toEqual(expected);
  });
});

describe("questions", () => {
  test("map comment", () => {
    const dbUser = new UserModel({
      firstName: "Pesho",
      surName: "Goshev",
      email: "bla@",
      intro: "introo",
      avatarSrc: "blaSrc",
      followers: [ObjectId(), ObjectId()],
      following: [ObjectId(), ObjectId()]
    }).toObject();

    const dbComment: dbTypes.Comment = {
      _id: ObjectId(),
      user: dbUser,
      value: "commentValue"
    };

    const gqlUser = gqlMapper.getUser({
      dbUser,
      loggedUserId: ObjectId().toHexString()
    });

    const expected: gqlTypes.Comment = {
      id: dbComment._id.toHexString(),
      user: gqlUser,
      value: "commentValue"
    };

    const actual = gqlMapper.getComment({
      dbComment,
      loggedUserId: ObjectId().toString()
    });

    expect(actual).toEqual(expected);
  });

  test("map answer", () => {
    const dbAnswer = new AnswerModel({
      position: 1,
      value: "ass",
      questionId: ObjectId(),
      userId: ObjectId()
    } as dbTypes.Answer).toObject();

    const expected: gqlTypes.Answer = {
      id: dbAnswer._id.toString(),
      position: dbAnswer.position,
      value: dbAnswer.value,
      questionId: dbAnswer.questionId.toString(),
      userId: dbAnswer.userId.toString(),
      comments: null,
      editions: null,
      likes: null
    };

    const actual = gqlMapper.getAnswer({
      dbAnswer,
      loggedUserId: ObjectId().toString()
    });

    expect(actual).toEqual(expected);
  });

  test("map gql likes", () => {
    const dbUser = new UserModel({
      firstName: "Pesho",
      surName: "Goshev",
      email: "bla@",
      intro: "introo",
      avatarSrc: "blaSrc",
      followers: [ObjectId(), ObjectId()],
      following: [ObjectId(), ObjectId()]
    }).toObject();

    const gqlUser = gqlMapper.getUser({ dbUser, loggedUserId: "" });
    const dbLikes: dbTypes.Likes = {
      total: 1,
      likers: [{ user: dbUser, numOfLikes: 1 }]
    };
    const actual = gqlMapper.getLikes({ dbLikes, loggedUserId: "" });
    const expected: gqlTypes.Likes = {
      total: 1,
      likers: [{ user: gqlUser, numOfLikes: 1 }]
    };

    expect(actual).toEqual(expected);
  });

  test("map answer with likes", () => {
    const dbUser = new UserModel({
      firstName: "Pesho",
      surName: "Goshev",
      email: "bla@",
      intro: "introo",
      avatarSrc: "blaSrc",
      followers: [ObjectId(), ObjectId()],
      following: [ObjectId(), ObjectId()]
    }).toObject();

    const dbLikes: dbTypes.Likes = {
      total: 1,
      likers: [{ user: dbUser, numOfLikes: 1 }]
    };

    const dbAnswer = new AnswerModel({
      position: 1,
      value: "ass",
      questionId: ObjectId(),
      userId: ObjectId(),
      likes: dbLikes
    } as dbTypes.Answer).toObject();

    const gqlLikes = gqlMapper.getLikes({ dbLikes, loggedUserId: "" });

    const expected: gqlTypes.Answer = {
      id: dbAnswer._id.toString(),
      position: dbAnswer.position,
      value: dbAnswer.value,
      questionId: dbAnswer.questionId.toString(),
      userId: dbAnswer.userId.toString(),
      likes: gqlLikes,
      comments: null,
      editions: null
    };

    const actual = gqlMapper.getAnswer({
      dbAnswer,
      loggedUserId: ObjectId().toString()
    });

    expect(actual).toEqual(expected);
  });

  test("map editions", () => {
    const dbEdition: dbTypes.Edition = {
      _id: ObjectId(),
      date: new Date(),
      before: "beforee",
      after: "after"
    };

    const actual = gqlMapper.getAnswerEditions({
      dbEditions: [dbEdition]
    });

    const expected: gqlTypes.AnswerEdition[] = [
      {
        id: dbEdition._id.toHexString(),
        date: dbEdition.date,
        before: "beforee",
        after: "after"
      }
    ];

    expect(actual).toEqual(expected);
  });

  test("map answer with editions", () => {
    const dbEdition: dbTypes.Edition = {
      _id: ObjectId(),
      date: new Date(),
      before: "beforee",
      after: "after"
    };

    const dbAnswer = new AnswerModel({
      position: 1,
      value: "ass",
      questionId: ObjectId(),
      userId: ObjectId(),
      editions: [dbEdition]
    } as dbTypes.Answer).toObject();

    const gqlEditions = gqlMapper.getAnswerEditions({
      dbEditions: [dbEdition]
    });

    const expected: gqlTypes.Answer = {
      id: dbAnswer._id.toString(),
      position: dbAnswer.position,
      value: dbAnswer.value,
      questionId: dbAnswer.questionId.toString(),
      userId: dbAnswer.userId.toString(),
      editions: gqlEditions,
      comments: null,
      likes: null
    };

    const actual = gqlMapper.getAnswer({
      dbAnswer,
      loggedUserId: ObjectId().toString()
    });

    expect(actual).toEqual(expected);
  });

  test("map question without answer", () => {
    const dbQuestion = new QuestionModel({
      value: "haha?",
      tags: ["fasa"]
    }).toObject();

    const expected: gqlTypes.Question = {
      id: dbQuestion._id.toString(),
      value: "haha?",
      tags: ["fasa"]
    };

    const actual = gqlMapper.getQuestion({
      dbQuestion,
      loggedUserId: dbQuestion._id.toString()
    });

    expect(actual).toEqual(expected);
  });

  test("map question with answer", () => {
    const dbQuestion = new QuestionModel({
      value: "haha?",
      tags: ["fasa"]
    }).toObject();

    const dbAnswer = new AnswerModel({
      position: 1,
      value: "ass",
      questionId: dbQuestion._id,
      userId: ObjectId()
    } as dbTypes.Answer).toObject();

    const expectedQ: gqlTypes.Question = {
      id: dbQuestion._id.toString(),
      value: "haha?",
      tags: ["fasa"]
    };

    const expectedA: gqlTypes.Answer = {
      id: dbAnswer._id.toString(),
      position: dbAnswer.position,
      value: dbAnswer.value,
      questionId: dbAnswer.questionId.toString(),
      userId: dbAnswer.userId.toString(),
      comments: null,
      editions: null,
      likes: null
    };

    expectedQ.answer = expectedA;

    const actual = gqlMapper.getQuestion({
      dbQuestion,
      dbAnswer,
      loggedUserId: dbQuestion._id.toString()
    });

    expect(actual).toEqual(expectedQ);
  });
});

test("getNotification", () => {
  const dbNotif: dbTypes.Notification = {
    _id: ObjectId(),
    commentId: "",
    performerAvatarSrc: "",
    performerId: "",
    questionId: "",
    seen: false,
    text: "fdfdf",
    type: dbTypes.NotificationType.NewComment
  };

  const actual = gqlMapper.getNotification(dbNotif);
  const expected: gqlTypes.NewComment = {
    id: dbNotif._id.toHexString(),
    commentId: "",
    performerAvatarSrc: "",
    performerId: "",
    questionId: "",
    seen: false,
    text: "fdfdf",
    type: dbTypes.NotificationType.NewComment,
    createdOn: dbNotif._id.getTimestamp()
  };

  expect(actual).toEqual(expected);
});
