import { AnswerModel } from "../models/answer";
import { NewsfeedModel } from "../models/newsfeed";
import { QuestionModel } from "../models/question";
import { UserModel } from "../models/user";

import answerC from "./answerController";
import commentC from "./commentController";
import newsfeedC from "./newsfeedController";
import notificationC from "./notificationController";
import questionC from "./questionController";
import userC from "./userController";

const userController = userC(UserModel);
const questionController = questionC(QuestionModel);
const answerController = answerC(AnswerModel, UserModel);
const commentController = commentC(AnswerModel);
const notificationController = notificationC(UserModel, AnswerModel);
const newsfeedController = newsfeedC(NewsfeedModel);

// injecting the Models from here in case I want to do testing later
export {
  userController,
  questionController,
  answerController,
  commentController,
  notificationController,
  newsfeedController
};
