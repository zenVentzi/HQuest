const userController = require('./userController');
const questionController = require('./questionController');
const answerController = require('./answerController');
const commentController = require('./commentController');
const notificationController = require('./notificationController');
const newsfeedController = require('./newsfeedController');
const { UserModel } = require('../models/user');
const { QuestionModel } = require('../models/question');
const { AnswerModel } = require('../models/answer');
// const { CommentModel } = require('../models/comment'); // comments are in the Answer model
// const { NotificationModel } = require('../models/notification'); // notifications are in the User model
const { NewsfeedModel } = require('../models/newsfeed');

// passing the Models from here in case I want to do testing later
module.exports = {
  userController: userController(UserModel),
  questionController: questionController(QuestionModel),
  answerController: answerController(AnswerModel),
  commentController: commentController(AnswerModel),
  notificationController: notificationController(UserModel),
  newsfeedController: newsfeedController(NewsfeedModel),
};
