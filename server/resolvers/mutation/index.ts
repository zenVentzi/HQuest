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

import { Maybe, MutationResolvers } from "../../generated/gqltypes";
// import { ApolloContext } from "gqlContext";

const notifsMarkSeen: MutationResolvers.NotifsMarkSeenResolver = async (
  _,
  __,
  context
) => {
  await notificationService.markSeen(context);
  return true; // fix: remove that
};

export default {
  notifsMarkSeen
};
