import { Types } from "mongoose";
import * as dbTypes from "../../../dbTypes";
import * as gqlTypes from "../../../generated/gqltypes";
import { mapAnswer, mapAnswerEditions, mapLikes } from "./gqlMapper";
import { models } from "../../../models";
import { mapUser } from "../../user/gqlMapper";

const { ObjectId } = Types;

test("map answer", () => {
  const dbAnswer = new models.answer({
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
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId(),
    likes: dbLikes
  } as dbTypes.Answer).toObject();

  const gqlLikes = mapLikes({ dbLikes, loggedUserId: "" });

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
    before: "beforee",
    after: "after"
  };

  const actual = mapAnswerEditions({
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

test("getAnswer() should return gql object with editions", () => {
  const dbEdition: dbTypes.Edition = {
    _id: ObjectId(),
    date: new Date(),
    before: "beforee",
    after: "after"
  };

  const dbAnswer = new models.answer({
    position: 1,
    value: "ass",
    questionId: ObjectId(),
    userId: ObjectId(),
    editions: [dbEdition]
  } as dbTypes.Answer).toObject();

  const gqlEditions = mapAnswerEditions({
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

  const actual = mapAnswer({
    dbAnswer,
    loggedUserId: ObjectId().toString()
  });

  expect(actual).toEqual(expected);
});
