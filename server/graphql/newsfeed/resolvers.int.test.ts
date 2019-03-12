import { Types as GooseTypes } from "mongoose";
import { services } from "../../services";
import { models } from "../../models";
import { Query } from "./resolvers";

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

// test("newsfeed() should return newsfeed", async done => {
//   const performer = (await new models.user({
//     ...contextUser,
//     _id: ObjectId()
//   } as DbTypes.User).save()).toObject();

//   await new models.user({
//     ...contextUser,
//     following: [performer._id]
//   } as DbTypes.User).save();

//   const questionDb = (await new models.question({
//     _id: ObjectId(),
//     value: "hahaQuestion",
//     tags: ["tag1"]
//   } as DbTypes.Question).save()).toObject();

//   const answerDb = (await new models.answer({
//     _id: ObjectId(),
//     position: 1,
//     questionId: questionDb._id,
//     userId: contextUser._id,
//     value: "answerrrValue"
//   } as DbTypes.Answer).save()).toObject();

//   // new NewsfeedModel.save suddenly decided that it's not gonna work. Cool.
//   await models.newsfeed.create({
//     _id: ObjectId(),
//     answerId: answerDb._id.toHexString(),
//     answerOwnerId: answerDb.userId.toHexString(),
//     performerId: performer._id.toHexString(),
//     type: DbTypes.NewsType.NewAnswer
//   } as DbTypes.AnswerNews);
//   // const newsfeed = (await NewsfeedModel.find().lean()) as DbTypes.Newsfeed;
//   const newsfeed = await Query.newsfeed({}, {}, context, {} as any);
//   const actual = newsfeed!.length;
//   const expected = 1;
//   expect(actual).toEqual(expected);
//   done();
// });
