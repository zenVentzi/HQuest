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

async function questions(root, { userId, all }, context) {
  const res = {
    answered: await questionController.getAnsweredQuestions(userId, context),
  };

  if (all) {
    res.unanswered = await questionController.getUnansweredQuestions(
      userId,
      context
    );
  }

  return res;
}

async function users(_, { match }, context) {
  return userController.getMatchingUsers(match, context);
}

async function user(_, { id }, context) {
  return userController.getUser(id, context);
}

module.exports = {
  books,
  comments,
  notifications,
  users,
  user,
  questions,
};
