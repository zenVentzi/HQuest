const { ObjectId } = require('mongoose').Types;

const { isAuthenticatedResolver } = require('../accessResolvers');
const {
  userController,
  commentController,
  questionController,
  notificationController,
} = require('../../controllers');

async function books(root, __, context) {
  return null;
}

async function notifications(_, __, context) {
  return notificationController.getNotifications(context);
}

async function comments(_, { answerId }, context) {
  return commentController.getAnswerComments(answerId, context);
}

async function followers(_, { userId }, context) {
  return userController.getFollowers(userId, context);
}

async function following(_, { userId }, context) {
  return userController.getFollowing(userId, context);
}

async function questions(root, args, context) {
  return questionController.getUserQuestionConnection(args, context);
}

const questionsTags = async (_, __, context) => {
  return questionController.getAllTags(context);
};

async function answeredQuestion(_, { userId, questionId }, context) {
  return questionController.getAnsweredQuestion(userId, questionId, context);
}

async function users(_, { match }, context) {
  return userController.getUsers(match, context);
}

async function user(_, { id }, context) {
  return userController.getUser(id, context);
}

module.exports = {
  books,
  comments,
  notifications,
  users,
  followers,
  following,
  user,
  questions,
  questionsTags,
  answeredQuestion,
};
