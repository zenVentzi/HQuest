import { Types } from "mongoose";
import * as dbTypes from "../../dbTypes";
import * as gqlTypes from "./../autoGenTypes";
import { mapNews, mapNewsfeed } from "./gqlMapper";
import { models } from "../../models";
import { mapUser } from "./../user/gqlMapper";
// import { mapQuestion } from "./../question/gqlMapper";

const { ObjectId } = Types;

test("getNewsfeed() to return newsfeed with NewFollowerNews", () => {
  const followedDb: dbTypes.User = {
    _id: ObjectId(),
    firstName: "PeshoPerformer",
    surName: "Goshev",
    email: "bla@",
    intro: "introo",
    avatarSrc: "blaSrc",
    experience: 0,
    role: dbTypes.UserRoles.User
  };
  const performerDb: dbTypes.User = {
    _id: ObjectId(),
    firstName: "PeshoFollowed",
    surName: "Goshev",
    email: "bla@",
    intro: "introo",
    avatarSrc: "blaSrc",
    experience: 0,
    role: dbTypes.UserRoles.User
  };
  const newsfeedUsers: dbTypes.User[] = [followedDb, performerDb];
  const newsfeed: dbTypes.Newsfeed = [
    {
      _id: ObjectId(),
      type: dbTypes.NewsType.NewFollower,
      followedUserId: followedDb._id.toHexString(),
      performerId: performerDb._id.toHexString()
    }
  ];

  const followedUser: gqlTypes.User = mapUser(followedDb, "");
  const performer: gqlTypes.User = mapUser(performerDb, "");

  const expected: gqlTypes.NewFollowerNews = {
    type: gqlTypes.NewsType.NewFollower,
    createdOn: newsfeed[0]._id.getTimestamp(),
    followedUser,
    performer
  };
  const actual = mapNewsfeed(
    newsfeed,
    newsfeedUsers,
    null,
    ObjectId().toHexString()
  )![0];

  expect(actual).toEqual(expected);
});

// TODO uncomment tests

// test("getNewsfeed() to return newsfeed with NewLikeNews", () => {
//   const performerDb: dbTypes.User = {
//     _id: ObjectId(),
//     firstName: "PeshoLiker",
//     surName: "Goshev",
//     email: "bla@",
//     intro: "introo",
//     avatarSrc: "blaSrc"
//   };
//   const answerOwnerDb: dbTypes.User = {
//     _id: ObjectId(),
//     firstName: "PeshoOwner",
//     surName: "Goshev",
//     email: "bla@",
//     intro: "introo",
//     avatarSrc: "blaSrc"
//   };
//   const answerOwnerGql = mapUser(answerOwnerDb, "");

//   const questionId = ObjectId();
//   const newsfeedQuestion: dbTypes.AnsweredQuestion = {
//     _id: questionId,
//     tags: ["blaTag"],
//     value: "qValue",
//     answer: {
//       _id: ObjectId(),
//       value: "aValue",
//       position: 1,
//       questionId,
//       userId: answerOwnerDb._id
//     }
//   };

//   const newLikeNews: dbTypes.NewLikeNews = {
//     _id: ObjectId(),
//     type: dbTypes.NewsType.NewLike,
//     performerId: performerDb._id.toHexString(),
//     answerId: newsfeedQuestion.answer._id.toHexString(),
//     answerOwnerId: answerOwnerDb._id.toHexString()
//   };

//   const gqlQuestion = mapQuestion(
//     "",
//     newsfeedQuestion,
//     newsfeedQuestion.answer
//   );

//   const performer: gqlTypes.User = mapUser(performerDb, "");

//   const expected: gqlTypes.NewLikeNews = {
//     type: gqlTypes.NewsType.NewLike,
//     createdOn: newLikeNews._id.getTimestamp(),
//     performer,
//     answerOwner: answerOwnerGql,
//     question: gqlQuestion
//   };
//   const actual = mapNewsfeed(
//     [newLikeNews],
//     [performerDb, answerOwnerDb],
//     [newsfeedQuestion],
//     ""
//   )![0];

//   expect(actual).toEqual(expected);
// });

// test("getNewsfeed() to return newsfeed with NewAnswerNews", () => {
//   const performerDb: dbTypes.User = {
//     _id: ObjectId(),
//     firstName: "PeshoLiker",
//     surName: "Goshev",
//     email: "bla@",
//     intro: "introo",
//     avatarSrc: "blaSrc"
//   };
//   const answerOwnerDb: dbTypes.User = {
//     _id: ObjectId(),
//     firstName: "PeshoOwner",
//     surName: "Goshev",
//     email: "bla@",
//     intro: "introo",
//     avatarSrc: "blaSrc"
//   };
//   const answerOwnerGql = mapUser(answerOwnerDb, "");

//   const questionId = ObjectId();
//   const newsfeedQuestion: dbTypes.AnsweredQuestion = {
//     _id: questionId,
//     tags: ["blaTag"],
//     value: "qValue",
//     answer: {
//       _id: ObjectId(),
//       value: "aValue",
//       position: 1,
//       questionId,
//       userId: answerOwnerDb._id
//     }
//   };

//   const newAnswerNews: dbTypes.AnswerNews = {
//     _id: ObjectId(),
//     type: dbTypes.NewsType.NewAnswer,
//     performerId: performerDb._id.toHexString(),
//     answerId: newsfeedQuestion.answer._id.toHexString(),
//     answerOwnerId: answerOwnerDb._id.toHexString()
//   };

//   const gqlQuestion = mapQuestion(
//     "",
//     newsfeedQuestion,
//     newsfeedQuestion.answer
//   );

//   const performer: gqlTypes.User = mapUser(performerDb, "");

//   const expected: gqlTypes.NewLikeNews = {
//     type: gqlTypes.NewsType.NewAnswer,
//     createdOn: newAnswerNews._id.getTimestamp(),
//     performer,
//     answerOwner: answerOwnerGql,
//     question: gqlQuestion
//   };
//   const actual = mapNewsfeed(
//     [newAnswerNews],
//     [performerDb, answerOwnerDb],
//     [newsfeedQuestion],
//     ""
//   )![0];

//   expect(actual).toEqual(expected);
// });

// test("getNewsfeed() to return newsfeed with NewCommentNews", () => {
//   const performerDb: dbTypes.User = {
//     _id: ObjectId(),
//     firstName: "PeshoLiker",
//     surName: "Goshev",
//     email: "bla@",
//     intro: "introo",
//     avatarSrc: "blaSrc"
//   };
//   const answerOwnerDb: dbTypes.User = {
//     _id: ObjectId(),
//     firstName: "PeshoOwner",
//     surName: "Goshev",
//     email: "bla@",
//     intro: "introo",
//     avatarSrc: "blaSrc"
//   };
//   const answerOwnerGql = mapUser(answerOwnerDb, "");

//   const questionId = ObjectId();
//   const newsfeedQuestion: dbTypes.AnsweredQuestion = {
//     _id: questionId,
//     tags: ["blaTag"],
//     value: "qValue",
//     answer: {
//       _id: ObjectId(),
//       value: "aValue",
//       position: 1,
//       questionId,
//       userId: answerOwnerDb._id
//     }
//   };

//   const newCommentNews: dbTypes.CommentNews = {
//     _id: ObjectId(),
//     type: dbTypes.NewsType.NewComment,
//     performerId: performerDb._id.toHexString(),
//     answerId: newsfeedQuestion.answer._id.toHexString(),
//     answerOwnerId: answerOwnerDb._id.toHexString(),
//     commentId: ""
//   };

//   const gqlQuestion = mapQuestion(
//     "",
//     newsfeedQuestion,
//     newsfeedQuestion.answer
//   );

//   const performer: gqlTypes.User = mapUser(performerDb, "");

//   const expected: gqlTypes.CommentNews = {
//     type: gqlTypes.NewsType.NewComment,
//     createdOn: newCommentNews._id.getTimestamp(),
//     performer,
//     answerOwner: answerOwnerGql,
//     question: gqlQuestion,
//     commentId: ""
//   };
//   const actual = mapNewsfeed(
//     [newCommentNews],
//     [performerDb, answerOwnerDb],
//     [newsfeedQuestion],
//     ""
//   )![0];

//   expect(actual).toEqual(expected);
// });
