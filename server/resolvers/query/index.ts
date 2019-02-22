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

export default {
  notifications,
  newsfeed
};
