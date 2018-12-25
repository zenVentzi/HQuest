const { ObjectId } = require('mongoose').Types;

const { isAuthenticatedResolver } = require('../accessResolvers');
const {
  userController,
  commentController,
  questionController,
  answerController,
  notificationController,
  newsfeedController,
} = require('../../controllers');

async function books(root, __, context) {
  return null;
}

const notifications = isAuthenticatedResolver.createResolver(
  async (_, __, context) => {
    return notificationController.getNotifications(context);
  }
);

const newsfeed = async (_, __, context) => {
  return newsfeedController.getNewsfeed({ context });
};

async function followers(_, { userId }, context) {
  return userController.getFollowers(userId, context);
}

async function following(_, { userId }, context) {
  return userController.getFollowing(userId, context);
}

async function questions(root, args, context) {
  const answers = await answerController.getUserAnswers(
    { userId: args.userId },
    context
  );

  return questionController.getUserQuestionConnection(
    { ...args, answers },
    context
  );
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

const user = isAuthenticatedResolver.createResolver((_, { id }, context) => {
  return userController.getUser(id, context);
});

module.exports = {
  books,
  notifications,
  newsfeed,
  users,
  followers,
  following,
  user,
  questions,
  questionsTags,
  answeredQuestion,
};
