import { Types } from "mongoose";
import { Maybe, QueryResolvers } from "../../generated/gqltypes";
import * as GqlTypes from "../../generated/gqltypes";
import {
  answerService,
  commentService,
  newsfeedService,
  notificationService,
  questionService,
  userService
} from "../../services";

const { ObjectId } = Types;

const notifications: QueryResolvers.NotificationsResolver = async (
  _,
  __,
  context
) => {
  const dbNotifications = await notificationService.getNotifications(context);

  const gqlNotifications = gqlMapper.getNotifications(dbNotifications);
  return gqlNotifications;
};

const newsfeed: QueryResolvers.NewsfeedResolver = async (_, __, context) => {
  const newsfeedDb = await newsfeedService.getNewsfeed(context);
  const newsfeedQuestions = await newsfeedService.getNewsFeedQuestions(
    newsfeedDb,
    context
  );
  const newsfeedUsers = await newsfeedService.getNewsFeedUsers(
    newsfeedDb,
    context
  );

  const gqlNewsfeed = gqlMapper.getNewsfeed(
    newsfeedDb,
    newsfeedUsers,
    newsfeedQuestions,
    context.user!.id
  );

  return gqlNewsfeed;
};

export default {
  notifications,
  newsfeed
};
