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

const commentAnswer: MutationResolvers.CommentAnswerResolver = async (
  _,
  { answerId, comment },
  context
) => {
  const dbAnswer = await answerService.getAnswerById(answerId, context);
  const dbComment = await commentService.addCommentToAnswer(
    {
      comment,
      answerId
    },
    context
  );

  if (!dbComment) throw Error("Failed to add comment");

  await newsfeedService.onNewComment(
    dbAnswer,
    dbComment._id.toString(),
    context.user!.id,
    context
  );
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
  return questionService.addQuestions({ questions }, context) as any;
};

const questionNotApply: MutationResolvers.QuestionNotApplyResolver = async (
  _,
  args,
  context
) => {
  const dbQuestion = await questionService.markNotApply(args, context);
  return gqlMapper.getQuestion(context.user!.id, dbQuestion);
};

const editAnswer: MutationResolvers.EditAnswerResolver = async (
  _,
  args,
  context
) => {
  const dbAnswer = await answerService.edit(args, context);

  await newsfeedService.onEditAnswer(args.answerId, context.user!.id, context);

  return gqlMapper.getAnswer({ dbAnswer, loggedUserId: context.user!.id });
};

const addAnswer: MutationResolvers.AddAnswerResolver = async (
  _,
  args,
  context
) => {
  const dbAnswer = await answerService.add(args, context);

  await newsfeedService.onNewAnswer(
    dbAnswer._id.toHexString(),
    context.user!.id,
    context
  );

  return gqlMapper.getAnswer({ dbAnswer, loggedUserId: context.user!.id });
};

const removeAnswer: MutationResolvers.RemoveAnswerResolver = async (
  _,
  args,
  context
) => {
  const dbAnswer = await answerService.remove(args, context);

  return gqlMapper.getAnswer({ dbAnswer, loggedUserId: context.user!.id });
};
const likeAnswer: MutationResolvers.LikeAnswerResolver = async (
  _,
  args,
  context
) => {
  const dbUserLiker = (await userService.getUser(
    { id: context.user!.id },
    context
  ))!;
  const dbAnswer = await answerService.like({ ...args, dbUserLiker }, context);
  await newsfeedService.onLikeAnswer(dbAnswer, context.user!.id, context);
  return gqlMapper.getAnswer({ dbAnswer, loggedUserId: context.user!.id });
};
const moveAnswerPosition: MutationResolvers.MoveAnswerPositionResolver = async (
  _,
  args,
  context
) => {
  return answerService.movePosition(args, context);
};

const uploadAvatar: MutationResolvers.UploadAvatarResolver = async (
  _,
  args,
  context
) => {
  const avatarSrc = await userService.uploadAvatar(args, context);
  return avatarSrc;
};

const follow: MutationResolvers.FollowResolver = async (_, args, context) => {
  if (args.follow) {
    await userService.follow(args, context);
    await newsfeedService.onFollowUser(args.userId, context.user!.id, context);
    await notificationService.newFollower({ receiverId: args.userId }, context);
  } else {
    await userService.unfollow(args, context);
  }

  return args.follow; // fix: this is not needed
};

const notifsMarkSeen: MutationResolvers.NotifsMarkSeenResolver = async (
  _,
  __,
  context
) => {
  await notificationService.markSeen(context);
  return true; // fix: remove that
};

export default {
  notifsMarkSeen,
  commentAnswer,
  editComment,
  removeComment,
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
