// const userController = require('./userController');
import userC from "./userController";
import questionC from "./questionController";
import answerC from "./answerController";
import commentC from "./commentController";
import notificationC from "./notificationController";
import newsfeedC from "./newsfeedController";
import { UserModel } from "../models/user";

// const { UserModel } = require('../models/user');
const { QuestionModel } = require("../models/question");
const { AnswerModel } = require("../models/answer");
// const { CommentModel } = require('../models/comment'); // comments are in the Answer model
// const { NotificationModel } = require('../models/notification'); // notifications are in the User model
const { NewsfeedModel } = require("../models/newsfeed");

const userController = userC(UserModel);
const questionController = questionC(QuestionModel);
const answerController = answerC(AnswerModel);
const commentController = commentC(AnswerModel);
const notificationController = notificationC(UserModel);
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
