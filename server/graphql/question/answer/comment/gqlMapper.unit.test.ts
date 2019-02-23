import { Types } from "mongoose";
import * as dbTypes from "../../../../dbTypes";
import * as gqlTypes from "../../../../generated/gqltypes";
import { mapComment, mapComments } from "./gqlMapper";
import { models } from "../../../../models";
import { mapUser } from "../../../user/gqlMapper";

const { ObjectId } = Types;

test("mapComment() should map db comment to gql", () => {
  const dbUser = new models.user({
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

  const gqlUser = mapUser(dbUser, ObjectId().toHexString());
  const expected: gqlTypes.Comment = {
    id: dbComment._id.toHexString(),
    user: gqlUser,
    value: "commentValue"
  };

  const actual = mapComment({
    dbComment,
    loggedUserId: ObjectId().toString()
  });

  expect(actual).toEqual(expected);
});
