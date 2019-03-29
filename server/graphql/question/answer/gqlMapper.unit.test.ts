import { Types } from "mongoose";
import * as dbTypes from "../../../dbTypes";
import * as gqlTypes from "../../autoGenTypes";
import { mapAnswer, mapAnswerEditions, mapLikes } from "./gqlMapper";
import { models } from "../../../models";
import { mapUser } from "../../user/gqlMapper";

const { ObjectId } = Types;

test("map answer", () => {
  const dbAnswer = new models.answer({
    _id: ObjectId(),
    position: 1,
    questionId: ObjectId(),
    userId: ObjectId(),
    editions: [{ _id: ObjectId(), date: new Date(), value: "ass" }]
  } as dbTypes.Answer).toObject();

  const expected: gqlTypes.Answer = {
    id: dbAnswer._id.toString(),
    position: dbAnswer.position,
    questionId: dbAnswer.questionId.toString(),
    userId: dbAnswer.userId.toString(),
    editions: [
      {
        id: dbAnswer.editions[0]._id.toHexString(),
        date: dbAnswer.editions[0].date,
        value: "ass",
        comments: null,
        likes: null
      }
    ]
  };

  const actual = mapAnswer({
    dbAnswer,
    loggedUserId: ObjectId().toString()
  });

  expect(actual).toEqual(expected);
});

test("map gql likes", () => {
  const dbUser = new models.user({
    firstName: "Pesho",
    surName: "Goshev",
    email: "bla@",
    intro: "introo",
    avatarSrc: "blaSrc",
    followers: [ObjectId(), ObjectId()],
    following: [ObjectId(), ObjectId()]
  }).toObject();

  const gqlUser = mapUser(dbUser, "");
  const dbLikes: dbTypes.Likes = {
    total: 1,
    likers: [{ user: dbUser, numOfLikes: 1 }]
  };
  const actual = mapLikes({ dbLikes, loggedUserId: "" });
  const expected: gqlTypes.Likes = {
    total: 1,
    likers: [{ user: gqlUser, numOfLikes: 1 }]
  };

  expect(actual).toEqual(expected);
});

test("getLikes() should return gql likes", () => {
  const dbUser = new models.user({
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

  const dbAnswer = new models.answer({
    position: 1,
    questionId: ObjectId(),
    userId: ObjectId(),
    editions: [
      { _id: ObjectId(), date: new Date(), value: "ass", likes: dbLikes }
    ]
  } as dbTypes.Answer).toObject();

  const gqlLikes = mapLikes({ dbLikes, loggedUserId: "" });

  const expected: gqlTypes.Answer = {
    id: dbAnswer._id.toString(),
    position: dbAnswer.position,
    questionId: dbAnswer.questionId.toString(),
    userId: dbAnswer.userId.toString(),
    editions: [
      {
        id: dbAnswer.editions[0]._id.toHexString(),
        date: dbAnswer.editions[0].date,
        value: "ass",
        comments: null,
        likes: gqlLikes
      }
    ]
  };

  const actual = mapAnswer({
    dbAnswer,
    loggedUserId: ObjectId().toString()
  });

  expect(actual).toEqual(expected);
});

test("getAnswerEditions() should return gql editions", () => {
  const dbEdition: dbTypes.Edition = {
    _id: ObjectId(),
    date: new Date(),
    value: "ass"
  };

  const actual = mapAnswerEditions({
    dbEditions: [dbEdition],
    loggedUserId: ""
  });

  const expected: gqlTypes.AnswerEdition[] = [
    {
      id: dbEdition._id.toHexString(),
      date: dbEdition.date,
      value: "ass",
      comments: null,
      likes: null
    }
  ];

  expect(actual).toEqual(expected);
});

test("getAnswer() should return gql object with editions", () => {
  const dbEdition: dbTypes.Edition = {
    _id: ObjectId(),
    date: new Date(),
    value: "ass"
  };

  const dbAnswer = new models.answer({
    position: 1,
    // value: "ass",
    questionId: ObjectId(),
    userId: ObjectId(),
    editions: [dbEdition]
  } as dbTypes.Answer).toObject();

  const gqlEditions = mapAnswerEditions({
    dbEditions: [dbEdition],
    loggedUserId: ""
  });

  const expected: gqlTypes.Answer = {
    id: dbAnswer._id.toString(),
    position: dbAnswer.position,
    questionId: dbAnswer.questionId.toString(),
    userId: dbAnswer.userId.toString(),
    editions: gqlEditions
    // comments: null,
    // likes: null
  };

  const actual = mapAnswer({
    dbAnswer,
    loggedUserId: ObjectId().toString()
  });

  expect(actual).toEqual(expected);
});
