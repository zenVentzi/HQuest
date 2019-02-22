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

export default {
  notifsMarkSeen
};
