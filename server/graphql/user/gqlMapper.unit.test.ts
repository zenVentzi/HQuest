import equal from "deep-equal";
import { Types } from "mongoose";
import * as dbTypes from "../../dbTypes";
import * as gqlTypes from "../autoGenTypes";
import { mapUser, mapUsers } from "./gqlMapper";
import { models } from "../../models";

const { ObjectId } = Types;

test("map user without following/followers", async () => {
  const dbUser = new models.user({
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
    avatarSrc: "blaSrc",
    experience: 0
  };

  const actual = mapUser(dbUser, dbUser._id.toString());

  expect(actual).toEqual(expected);
});

test("map user with following/followers", async () => {
  const dbUser = new models.user({
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
    following: dbUser.following!.map(f => f.toString()),
    experience: 0
  };

  const actual = mapUser(dbUser, dbUser._id.toString());

  expect(actual).toEqual(expected);
});
test("map users", async () => {
  const dbUser1 = new models.user({
    firstName: "Pesho",
    surName: "Goshev",
    email: "bla@",
    intro: "introo",
    avatarSrc: "blaSrc",
    followers: [ObjectId(), ObjectId()],
    following: [ObjectId(), ObjectId()]
  }).toObject();

  const dbUser2 = new models.user({
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
    following: dbUser1.following!.map(f => f.toString()),
    experience: 0
  };

  const expected2: gqlTypes.User = {
    id: dbUser2._id.toString(),
    fullName: "Pesho1 Goshev",
    intro: "introo",
    me: false,
    email: "bla@",
    avatarSrc: "blaSrc",
    followers: dbUser2.followers!.map(f => f.toString()),
    following: dbUser2.following!.map(f => f.toString()),
    experience: 0
  };

  const expected = [expected1, expected2];

  const actual = mapUsers({
    dbUsers,
    loggedUserId: dbUser1._id.toString()
  });

  expect(actual).toEqual(expected);
});
