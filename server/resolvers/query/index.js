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
const { gqlMapper } = require('../../gqlMapper');

async function books(root, __, context) {
  return null;
}

const notifications = isAuthenticatedResolver.createResolver(
  async (_, __, context) => {
    return notificationController.getNotifications(context);
  }
);

const newsfeed = async (_, __, context) => {
  const loggedUser = userController.getUser({ userId: context.user.id });
  const followingUsersIds = loggedUser.following;
  const newsfeedd = newsfeedController.getUsersActivity({
    usersIds: followingUsersIds,
  });
  const participantsIds = newsfeedController.getParticipantsIds({
    newsfeed: newsfeedd,
  });

  const newsFeedUsers = await userController.getUsersWithIds({
    ids: participantsIds,
  });

  const newsfeedAnswersIds = [];

  newsfeed.forEach(news => {
    if (news.answerId) {
      newsfeedAnswersIds.push(news.answerId);
    }
  });

  const newsfeedAnswers = await answerController.getAnswersById({
    ids: newsfeedAnswersIds,
  });

  const newsfeedQuestionsIds = newsfeedAnswers.map(a => a.questionId);

  const newsfeedQuestions = await questionController.getQuestionsById({
    ids: newsfeedQuestionsIds,
  });

  const gqlNewsfeed = gqlMapper.getNewsfeed({
    newsfeed: newsfeedd,
    newsFeedUsers,
    newsfeedAnswers,
    newsfeedQuestions,
    loggedUserId: context.user.id,
  });
  return gqlNewsfeed.reverse();
};

async function followers(_, { userId }, { user }) {
  const dbFollowers = await userController.getFollowers({ userId });
  return gqlMapper.getUsers({ dbUsers: dbFollowers, loggedUserId: user.id });
}

async function following(_, { userId }, { user }) {
  const dbFollowing = await userController.getFollowing({ userId });
  return gqlMapper.getUsers({ dbUsers: dbFollowing, loggedUserId: user.id });
}

const getAllEdges = nodes => {
  return nodes.map(node => {
    const cursor = node.id;
    return {
      cursor,
      node,
    };
  });
};

const getCurrentPageEdges = ({ first, after }, allEdges) => {
  let startIndex = 0;

  if (after) {
    startIndex = allEdges.findIndex(e => e.cursor === after) + 1;
  }

  const endIndex = startIndex + first;
  const res = allEdges.slice(startIndex, endIndex);
  return res;
};

const getPageInfo = (allEdges, currentPageEdges) => {
  let startCursor;
  let endCursor;
  let hasPreviousPage = false;
  let hasNextPage = false;

  if (!allEdges.length) {
    hasPreviousPage = false;
    hasNextPage = false;
  } else if (!currentPageEdges.length) {
    hasPreviousPage = true;
    hasNextPage = false;
  } else {
    startCursor = currentPageEdges[0].cursor;
    endCursor = currentPageEdges[currentPageEdges.length - 1].cursor;
    const beforeStartCursor = edge =>
      ObjectId(edge.cursor) < ObjectId(startCursor);
    const afterEndCursor = edge => ObjectId(edge.cursor) > ObjectId(endCursor);

    hasPreviousPage = allEdges.filter(beforeStartCursor).length > 0;
    hasNextPage = allEdges.filter(afterEndCursor).length > 0;
  }

  return {
    startCursor,
    endCursor,
    hasPreviousPage,
    hasNextPage,
  };
};

// todo extract in utils/helper
const relayConnection = ({ nodes, first, after }) => {
  const allEdges = getAllEdges(nodes);
  const currentPageEdges = getCurrentPageEdges({ first, after }, allEdges);
  const pageInfo = getPageInfo(allEdges, currentPageEdges);

  const connection = {
    pageInfo,
    edges: currentPageEdges,
    totalCount: allEdges.length,
  };
  return connection;
};

const questions = isAuthenticatedResolver.createResolver(
  async (root, args, context) => {
    const answers = await answerController.getUserAnswers(
      { userId: args.userId },
      context
    );

    const dbQuestions = questionController.getUserQuestions({
      ...args,
      answers,
      loggedUserId: context.user.id,
    });
    const gqlQuestions = gqlMapper.getQuestions({
      dbQuestions,
      loggedUserId: context.user.id,
    });

    return relayConnection({ nodes: gqlQuestions, ...args });
  }
);

const questionsTags = async (_, __, context) => {
  return questionController.getAllTags();
};

async function answeredQuestion(_, { userId, questionId }, context) {
  const dbQuestion = questionController.getQuestion({ questionId });
  const dbAnswer = answerController.getAnswer({ userId, questionId });
  const res = gqlMapper.getQuestion({
    dbQuestion,
    dbAnswer,
    loggedUserId: context.user.id,
  });

  return res;
}

async function users(_, { match }, context) {
  const dbUsers = await userController.getUsers(match, context);

  const gqlUsers = gqlMapper.getUsers({
    dbUsers,
    loggedUserId: context.user.id,
  });

  return gqlUsers;
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
