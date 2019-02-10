import { AnswerModel } from "../models/answer";
import { NewsfeedModel } from "../models/newsfeed";
import { QuestionModel } from "../models/question";
import { UserModel } from "../models/user";

import answerS from "./answerService";
import commentS from "./commentService";
import newsfeedS from "./newsfeedService";
import notificationS from "./notificationService";
import questionS from "./questionService";
import userC from "./userService";

const userService = userC(UserModel);
const questionService = questionS(QuestionModel);
const answerService = answerS(AnswerModel, UserModel);
const commentService = commentS(AnswerModel);
const notificationService = notificationS(UserModel, AnswerModel);
const newsfeedService = newsfeedS(NewsfeedModel);

// injecting the Models from here in case I want to do testing later
export {
  userService,
  questionService,
  answerService,
  commentService,
  notificationService,
  newsfeedService
};
