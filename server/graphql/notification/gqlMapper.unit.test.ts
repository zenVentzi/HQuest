import { Types } from "mongoose";
import * as dbTypes from "../../dbTypes";
import * as gqlTypes from "./../autoGenTypes";
import { mapNotification, mapNotifications } from "./gqlMapper";
import { models } from "../../models";
import { mapUser } from "./../user/gqlMapper";

const { ObjectId } = Types;

test("getNotification()", () => {
  const dbNotif: dbTypes.NewComment = {
    _id: ObjectId(),
    questionId: "",
    editionId: "",
    commentId: "",
    performerAvatarSrc: "",
    userProfileId: "",
    performerId: "",
    seen: false,
    text: "fdfdf",
    type: dbTypes.NotificationType.NewComment
  };

  const actual = mapNotification(dbNotif);
  const expected: gqlTypes.NewComment = {
    id: dbNotif._id.toHexString(),
    questionId: "",
    editionId: "",
    commentId: "",
    performerAvatarSrc: "",
    userProfileId: "",
    performerId: "",
    seen: false,
    text: "fdfdf",
    type: dbTypes.NotificationType.NewComment,
    createdOn: dbNotif._id.getTimestamp()
  };

  expect(actual).toEqual(expected);
});
