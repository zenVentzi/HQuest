import { Types as GooseTypes } from "mongoose";
import { services } from "../../services";
import { models } from "../../models";
import { Query, Mutation } from "./resolvers";

import * as DbTypes from "../../dbTypes";
import * as GqlTypes from "../../generated/gqltypes";
import { ApolloContext } from "../../types/gqlContext";

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

  await new models.user({
    ...contextUser,
    notifications: [dbNotif]
  } as DbTypes.User).save();

  const notifs = await Query.notifications({}, {}, context, {} as any);
  const actual = notifs![0].id;
  const expected = dbNotif._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("notifications() should return null if not found", async done => {
  await new models.user({
    ...contextUser
    // notifications: [dbNotif]
  } as DbTypes.User).save();

  const notifs = await Query.notifications({}, {}, context, {} as any);
  const actual = notifs;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("notifsMarkSeen() should mark user notifications as seen", async done => {
  const follower = (await new models.user({
    email: "fdf@",
    firstName: "Pesho123",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save())!.toObject();
  const followed = (await new models.user({
    ...contextUser,
    notifications: [
      {
        _id: ObjectId(),
        type: DbTypes.NotificationType.NewFollower,
        performerId: follower._id.toHexString(),
        performerAvatarSrc: "srcc",
        seen: false,
        text: "comment new notif"
      }
    ]
  } as DbTypes.User).save()).toObject();
  const followedContext: ApolloContext = {
    ...context,
    user: { email: followed.email, id: followed._id.toHexString() }
  };

  await Mutation.notifsMarkSeen({}, {}, followedContext, {} as any);
  const followedUpdated = (await models.user.findById(
    followed._id
  ))!.toObject();

  const actual = followedUpdated.notifications![0].seen;
  const expected = true;
  expect(actual).toEqual(expected);
  done();
});
