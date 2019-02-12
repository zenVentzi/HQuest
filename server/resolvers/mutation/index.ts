import jsonwebtoken from "jsonwebtoken";
import {
  answerService,
  commentService,
  newsfeedService,
  notificationService,
  questionService,
  userService
} from "../../services";

// const jsonwebtoken = require("jsonwebtoken");
import { gqlMapper } from "../../gqlMapper";

import { Maybe, MutationResolvers } from "../../generated/gqltypes";
// import { ApolloContext } from "gqlContext";

// *book is for testing purposes
const addBook = async (root, args, context) => {};

const login: MutationResolvers.LoginResolver = async (_, args, context) => {
  const dbUser = await userService.login(args, context);

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
  const editedUser = await userService.editUser(args.input!, context);
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
  const dbComment = await commentService.addCommentToAnswer(
    {
      comment,
      answerId
    },
    context
  );

  if (!dbComment) throw Error("Failed to add comment");

  await newsfeedService.onNewComment({
    answerId,
    commentId: dbComment._id.toString()
  });
  await notificationService.newComment(
    {
      answerId,
      dbComment
    },
    context
  );

  return gqlMapper.getComment({
    dbComment,
    loggedUserId: context.user!.id
  });
};

const editComment: MutationResolvers.EditCommentResolver = async (
  _,
  args,
  context
) => {
  const dbComment = await commentService.editComment(args, context);

  if (dbComment) {
    return gqlMapper.getComment({
      dbComment,
      loggedUserId: context.user!.id
    });
  }

  throw Error("Failed to edit comment");
};

const removeComment: MutationResolvers.RemoveCommentResolver = async (
  _,
  args,
  context
) => {
  const dbComment = await commentService.removeComment(args, context);

  return gqlMapper.getComment({
    dbComment,
    loggedUserId: context.user!.id
  });
};

const addQuestions: MutationResolvers.AddQuestionsResolver = async (
  _,
  { questions },
  context
) => {
  return questionService.addQuestions({ questions }) as any;
};

const questionNotApply = async (_, args, context) => {
  return questionService.markNotApply(args);
};

const editAnswer = async (_, args, context) => {
  const dbAnswer = await answerService.edit(args, context);

  await newsfeedService.onEditAnswer({
    answer: dbAnswer,
    context
  });

  return gqlMapper.getAnswer({ dbAnswer, loggedUserId: context.user.id });
};

const addAnswer: MutationResolvers.AddAnswerResolver = async (
  _,
  args,
  context
) => {
  const dbAnswer = await answerService.add(args, context);

  await newsfeedService.onNewAnswer({
    answer: dbAnswer,
    context
  });

  return gqlMapper.getAnswer({ dbAnswer, loggedUserId: context.user.id });
};

const removeAnswer: MutationResolvers.RemoveAnswerResolver = async (
  _,
  args,
  context
) => {
  const dbAnswer = await answerService.remove(args, context);

  return gqlMapper.getAnswer({ dbAnswer, loggedUserId: context.user.id });
};
const likeAnswer = async (_, args, context) => {
  const dbUserLiker = await userService.getUser(args);
  const dbAnswer = await answerService.like({ ...args, dbUserLiker });
  await newsfeedService.onLikeAnswer({
    answerId: dbAnswer._id.toString(),
    context
  });
  return gqlMapper.getAnswer({ dbAnswer, loggedUserId: context.user.id });
};
const moveAnswerPosition = async (_, args, context) => {
  return answerService.movePosition(args, context);
};

const uploadAvatar = async (_, { base64Img }, context) => {
  const avatarSrc = await userService.uploadAvatar(base64Img, context);
  return avatarSrc;
};

const follow = async (_, { userId, follow: shouldFollow }, context) => {
  if (shouldFollow) {
    await userService.follow(userId, context);
    await newsfeedService.onFollowUser({ followedUserId: userId, context });
    await notificationService.newFollower(userId);
  } else {
    await userService.unfollow(userId, context);
  }
};

const notifsMarkSeen = async (_, __, context) => {
  await notificationService.markSeen(context);
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
