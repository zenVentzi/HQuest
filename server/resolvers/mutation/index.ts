import {
  userController,
  questionController,
  answerController,
  notificationController,
  newsfeedController,
  commentController
} from "../../controllers";
import jsonwebtoken from "jsonwebtoken";

// const jsonwebtoken = require("jsonwebtoken");
// const { createError } = require("apollo-errors");
import { gqlMapper } from "../../gqlMapper";

import { mapGqlAnswer, mapGqlComment } from "../../resolvers/helper";
import { MutationResolvers, Maybe } from "../../generated/gqltypes";

// *book is for testing purposes
const addBook = async (root, args, context) => {};

const login: MutationResolvers.LoginResolver = async (_, args, context) => {
  const dbUser = await userController.login(args);

  const authToken = jsonwebtoken.sign(
    { id: dbUser._id.toString(), email: dbUser.email },
    process.env.JWT_SECRET as jsonwebtoken.Secret,
    {
      expiresIn: "1d"
    }
  );
  const result = {
    authToken,
    userId: dbUser._id.toString()
  };

  return result;
};

const editUser: MutationResolvers.EditUserResolver = async (
  _,
  args,
  context
) => {
  const editedUser = await userController.editUser(args, context.user!.id);
  const gqlUser = gqlMapper.getUser({
    dbUser: editedUser,
    loggedUserId: context.user!.id
  });
  return gqlUser;
};

const commentAnswer: MutationResolvers.CommentAnswerResolver = async (
  _,
  { answerId, comment },
  context
) => {
  const dbComment = await commentController.addCommentToAnswer({
    answerId,
    comment
  });

  await newsfeedController.onNewComment({
    answerId,
    commentId: dbComment._id.toString()
  });
  await notificationController.newComment({
    answerId,
    dbComment,
    loggedUserId: context.user!.id
  });

  return mapGqlComment({
    dbComment,
    loggedUserId: context.user!.id
  });
};

const editComment: MutationResolvers.EditCommentResolver = async (
  _,
  args,
  context
) => {
  const dbComment = await commentController.editComment({ ...args, context });

  return mapGqlComment({
    dbComment,
    loggedUserId: context.user!.id
  });
};

const removeComment: MutationResolvers.RemoveCommentResolver = async (
  _,
  args,
  context
) => {
  const dbComment = await commentController.removeComment({
    ...args,
    context
  });

  return mapGqlComment({
    dbComment,
    loggedUserId: context.user!.id
  });
};

const addQuestions: MutationResolvers.AddQuestionsResolver = async (
  _,
  { questions },
  context
) => {
  return questionController.addQuestions({ questions }) as any;
};

const questionNotApply = async (_, args, context) => {
  return questionController.markNotApply(args);
};

const editAnswer = async (_, args, context) => {
  const answer = await answerController.edit(args, context);

  await newsfeedController.onEditAnswer({
    answer,
    context
  });

  return mapGqlAnswer({ answer, loggedUserId: context.user.id });
};

const addAnswer = async (_, args, context) => {
  const answer = await answerController.add(args, context);

  await newsfeedController.onNewAnswer({
    answer,
    context
  });

  return mapGqlAnswer({ answer, loggedUserId: context.user.id });
};

const removeAnswer = async (_, args, context) => {
  const removedAnswer = await answerController.remove(args, context);

  return mapGqlAnswer({ answer: removedAnswer, loggedUserId: context.user.id });
};
const likeAnswer = async (_, args, context) => {
  const dbUserLiker = await userController.getUser(args);
  const likedAnswer = await answerController.like({ ...args, dbUserLiker });
  await newsfeedController.onLikeAnswer({
    answerId: likedAnswer._id.toString(),
    context
  });
  return mapGqlAnswer({ answer: likedAnswer, loggedUserId: context.user.id });
};
const moveAnswerPosition = async (_, args, context) => {
  return answerController.movePosition(args, context);
};

const uploadAvatar = async (_, { base64Img }, context) => {
  const avatarSrc = await userController.uploadAvatar(base64Img, context);
  return avatarSrc;
};

const follow = async (_, { userId, follow: shouldFollow }, context) => {
  if (shouldFollow) {
    await userController.follow(userId, context);
    await newsfeedController.onFollowUser({ followedUserId: userId, context });
    await notificationController.newFollower(userId);
  } else {
    await userController.unfollow(userId, context);
  }
};

const notifsMarkSeen = async (_, __, context) => {
  await notificationController.markSeen(context);
};

export default {
  addBook,
  notifsMarkSeen,
  commentAnswer,
  editComment,
  removeComment,
  editUser,
  login,
  addQuestions,
  questionNotApply,
  addAnswer,
  editAnswer,
  removeAnswer,
  likeAnswer,
  moveAnswerPosition,
  uploadAvatar,
  follow
};
