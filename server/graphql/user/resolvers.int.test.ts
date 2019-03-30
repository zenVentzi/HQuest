import { Types as GooseTypes } from "mongoose";
import { services } from "../../services";
import { models } from "../../models";
import { Query, Mutation } from "./resolvers";

import * as DbTypes from "../../dbTypes";
import * as GqlTypes from "../autoGenTypes";
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

test("login() should login if user exists", async done => {
  const existingUser = await new models.user({
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

  const actual = await Mutation.login({}, args, context, {} as any);

  expect(existingUser._id).toBeTruthy();
  expect(actual.userId).toEqual(existingUser._id.toString());
  expect(actual.authToken).toBeTruthy();
  done();
});

test("login() should register if user doesn't exist", async done => {
  const args = { email: "fdf", name: "fdf hh" };

  const actual = await Mutation.login({}, args, context, {} as any);

  expect(actual.authToken).toBeTruthy();
  expect(actual.userId).toBeTruthy();
  done();
});

test("editUser() should edit existing user", async done => {
  const existingUser = (await new models.user(contextUser).save()).toObject();

  const args: GqlTypes.MutationEditUserArgs = {
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

  const actual = await Mutation.editUser({}, args, context, {} as any);

  expect(existingUser._id).toBeTruthy();
  expect(actual.fullName).toEqual(args.input!.fullName);
  expect(actual.intro).toEqual(args.input!.intro);
  done();
});

test("user() should return user if found", async done => {
  await new models.user(contextUser).save();
  const args: GqlTypes.QueryUserArgs = { id: contextUser._id.toHexString() };
  const user = await Query.user({}, args, context, {} as any);
  const actual = user!.id;
  const expected = contextUser._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("user() should return null if not found", async done => {
  const args: GqlTypes.QueryUserArgs = { id: contextUser._id.toHexString() };
  const user = await Query.user({}, args, context, {} as any);
  const actual = user;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("users() should return users that match 1 word", async done => {
  const user = await new models.user(contextUser).save();
  const user1 = await new models.user({
    ...contextUser,
    firstName: "hasan", // kade si we hasane auf england where are you hasane
    _id: ObjectId()
  } as DbTypes.User).save();
  const args: GqlTypes.QueryUsersArgs = { match: "hasan" };
  const users = await Query.users({}, args, context, {} as any);
  const actual = users![0].fullName;
  const expected = "hasan" + " " + contextUser.surName;
  expect(actual).toEqual(expected);
  done();
});

test("users() should return users that match 2 words", async done => {
  const user = await new models.user(contextUser).save();
  const user1 = await new models.user({
    ...contextUser,
    firstName: "hasan", // kade si we hasane auf england where are you hasane
    _id: ObjectId()
  } as DbTypes.User).save();
  const args: GqlTypes.QueryUsersArgs = {
    match: `hasan ${contextUser.surName}`
  };
  const users = await Query.users({}, args, context, {} as any);
  const actual = users![0].fullName;
  const expected = "hasan" + " " + contextUser.surName;
  expect(actual).toEqual(expected);
  done();
});

test("followers() should return followers if user has followers", async done => {
  const follower = (await new models.user({
    ...contextUser,
    _id: ObjectId()
  } as DbTypes.User).save())!.toObject();

  const followed = (await new models.user({
    ...contextUser,
    followers: [follower._id]
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.QueryFollowersArgs = {
    userId: followed._id.toHexString()
  };
  const followers = await Query.followers({}, args, context, {} as any);
  const actual = followers![0].id;
  const expected = follower._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("followers() should return null if user has no followers", async done => {
  // const follower = (await new models.user({
  //   ...contextUser,
  //   _id: ObjectId()
  // } as DbTypes.User).save())!.toObject();

  const userWithoutFollowers = (await new models.user({
    ...contextUser
    // followers: [follower._id]
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.QueryFollowersArgs = {
    userId: userWithoutFollowers._id.toHexString()
  };
  const followers = await Query.followers({}, args, context, {} as any);
  const actual = followers;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("followers() should return null if user is not found", async done => {
  const randomId = ObjectId().toHexString();
  const args: GqlTypes.QueryFollowersArgs = {
    userId: randomId
  };
  const followers = await Query.followers({}, args, context, {} as any);
  const actual = followers;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("following() should return following if user follows somebody", async done => {
  const randomUser = (await new models.user({
    ...contextUser,
    _id: ObjectId()
  } as DbTypes.User).save())!.toObject();

  const user = (await new models.user({
    ...contextUser,
    following: [randomUser._id]
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.QueryFollowersArgs = {
    userId: user._id.toHexString()
  };
  const following = await Query.following({}, args, context, {} as any);
  const actual = following![0].id;
  const expected = randomUser._id.toHexString();
  expect(actual).toEqual(expected);
  done();
});

test("following() should return nullshit if user doesn't follow anyone", async done => {
  const user = (await new models.user({
    ...contextUser
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.QueryFollowersArgs = {
    userId: user._id.toHexString()
  };
  const following = await Query.following({}, args, context, {} as any);
  const actual = following;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("following() should return nullshit if user doesn't exist", async done => {
  const randomId = ObjectId().toHexString();

  const args: GqlTypes.QueryFollowersArgs = {
    userId: randomId
  };
  const following = await Query.following({}, args, context, {} as any);
  const actual = following;
  const expected = null;
  expect(actual).toEqual(expected);
  done();
});

test("follow() should add followers to user doc", async done => {
  const existingUser = (await new models.user({
    email: "fdf@",
    firstName: "Pesho123",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.MutationFollowArgs = {
    follow: true,
    userId: existingUser._id.toHexString()
  };
  await Mutation.follow({}, args, context, {} as any);

  const updatedUser = (await models.user.findById(
    existingUser._id
  ))!.toObject();
  const actual = updatedUser.followers![0].toHexString();
  const expected = context.user!.id;
  expect(actual).toEqual(expected);
  done();
});

test("follow(false) should remove followers from user doc", async done => {
  const existingUser = (await new models.user({
    email: "fdf@",
    firstName: "Pesho123",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save())!.toObject();

  const args: GqlTypes.MutationFollowArgs = {
    follow: true,
    userId: existingUser._id.toHexString()
  };
  await Mutation.follow({}, args, context, {} as any);
  await Mutation.follow({}, { ...args, follow: false }, context, {} as any);

  const updatedUser = (await models.user.findById(
    existingUser._id
  ))!.toObject();
  const actual = updatedUser.followers;
  const expected = [] || undefined;
  expect(actual).toEqual(expected);
  done();
});

test("follow() should add notification to the followed user", async done => {
  const follower = (await new models.user({
    email: "fdf@",
    firstName: "Pesho123",
    surName: "Goeshev",
    intro: "blaIntro",
    avatarSrc: "test"
  } as DbTypes.User).save())!.toObject();

  const followedUser = (await new models.user(contextUser).save())!.toObject();

  const args: GqlTypes.MutationFollowArgs = {
    follow: true,
    userId: followedUser._id.toHexString()
  };

  const followerContext = { ...context };
  followerContext.user = {
    email: follower.email,
    id: follower._id.toHexString()
  };
  await Mutation.follow({}, args, followerContext, {} as any);

  const followedUserUpdated = (await models.user.findById(
    followedUser._id
  ))!.toObject();
  const actual = followedUserUpdated.notifications![0].seen;
  const expected = false;
  expect(actual).toEqual(expected);
  done();
});
