import { Types } from "mongoose";
import { Maybe, QueryResolvers } from "../../generated/gqltypes";
import { gqlMapper } from "../../gqlMapper";
import {
  answerService,
  commentService,
  newsfeedService,
  notificationService,
  questionService,
  userService
} from "../../services";

const { ObjectId } = Types;

// books is for testing
const books = async (root, __, context) => {
  return null;
};

const notifications: QueryResolvers.NotificationsResolver = async (
  _,
  __,
  context
) => {
  const dbNotifications = await notificationService.getNotifications(context);

  const gqlNotifications = gqlMapper.getNotifications(dbNotifications);
  return gqlNotifications;
};

const newsfeed: QueryResolvers.NewsfeedResolver = async (_, __, context) => {
  const loggedUser = await userService.getUser(
    { id: context.user!.id },
    context
  );
  const followingUsersIds = loggedUser.following;
  const newsfeedd = await newsfeedService.getUsersActivity({
    usersIds: followingUsersIds
  });
  const participantsIds = newsfeedService.getParticipantsIds({
    newsfeed: newsfeedd
  });

  const newsFeedUsers = await userService.getUsersWithIds(
    {
      ids: participantsIds
    },
    context
  );

  const newsfeedAnswersIds: string[] = [];
  // @ts-ignore

  newsfeedd.forEach(news => {
    if (news.answerId) {
      // @ts-ignore
      newsfeedAnswersIds.push(news.answerId);
    }
  });

  const newsfeedAnswers = await answerService.getAnswersById(
    {
      // @ts-ignore
      ids: newsfeedAnswersIds
    },
    context
  );

  const newsfeedQuestionsIds = newsfeedAnswers.map(a => a.questionId);

  const newsfeedQuestions = await questionService.getQuestionsById(
    {
      ids: newsfeedQuestionsIds
    },
    context
  );

  const gqlNewsfeed = gqlMapper.getNewsfeed({
    // @ts-ignore
    newsfeed: newsfeedd,
    newsFeedUsers,
    newsfeedAnswers,
    newsfeedQuestions,
    loggedUserId: context.user!.id
  });
  return gqlNewsfeed.reverse();
};

const followers: QueryResolvers.FollowersResolver = async (
  _,
  { userId },
  context
) => {
  const dbFollowers = await userService.getFollowers({ userId }, context);
  return gqlMapper.getUsers({
    dbUsers: dbFollowers,
    loggedUserId: context.user!.id
  });
};

const following: QueryResolvers.FollowingResolver = async (
  _,
  { userId },
  context
) => {
  const dbFollowing = await userService.getFollowing({ userId }, context);
  return gqlMapper.getUsers({
    dbUsers: dbFollowing,
    loggedUserId: context.user!.id
  });
};

const getAllEdges = nodes => {
  return nodes.map(node => {
    const cursor = node.id;
    return {
      cursor,
      node
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
    hasNextPage
  };
};

type RelayConnection = ({
  nodes,
  first,
  after
}: {
  nodes: any;
  first: number;
  after?: Maybe<string>;
}) => any;

// todo extract in utils/helper
const relayConnection: RelayConnection = ({ nodes, first, after }) => {
  const allEdges = getAllEdges(nodes);
  const currentPageEdges = getCurrentPageEdges({ first, after }, allEdges);
  const pageInfo = getPageInfo(allEdges, currentPageEdges);

  const connection = {
    pageInfo,
    edges: currentPageEdges,
    totalCount: allEdges.length
  };
  return connection;
};

const questions: QueryResolvers.QuestionsResolver = async (
  root,
  args,
  context
) => {
  const dbAnswers = await answerService.getUserAnswers(
    { userId: args.userId },
    context
  );

  const dbQuestions = await questionService.getUserQuestions(
    {
      answered: args.answered,
      answers: dbAnswers,
      tags: args.tags
    },
    context
  );

  const gqlQuestions = gqlMapper.getQuestions({
    dbQuestions,
    loggedUserId: context.user!.id
  });

  return relayConnection({ nodes: gqlQuestions, ...args });
};

const questionsTags: QueryResolvers.QuestionsTagsResolver = async (
  _,
  __,
  context
) => {
  return await questionService.getAllTags(context);
};

const answeredQuestion: QueryResolvers.AnsweredQuestionResolver = async (
  _,
  { userId, questionId },
  context
) => {
  const dbQuestion = await questionService.getQuestion({ questionId }, context);
  const dbAnswer = await answerService.getUserAnswer(
    { userId, questionId },
    context
  );
  const res = gqlMapper.getQuestion({
    dbQuestion,
    dbAnswer,
    loggedUserId: context.user!.id
  });

  return res;
};

const users: QueryResolvers.UsersResolver = async (_, args, context) => {
  const dbUsers = await userService.getUsers(args, context);
  const gqlUsers = gqlMapper.getUsers({
    dbUsers,
    loggedUserId: context.user!.id
  });

  if (!gqlUsers) {
    throw new Error("Failed to fetch users");
  }

  return gqlUsers;
};

const user: QueryResolvers.UserResolver = async (_, args, context) => {
  const dbUser = await userService.getUser(args, context);
  const gqlUser = gqlMapper.getUser({
    dbUser,
    loggedUserId: context.user!.id
  });
  return gqlUser;
};

export default {
  books,
  notifications,
  newsfeed,
  users,
  followers,
  following,
  user,
  questions,
  questionsTags,
  answeredQuestion
};
