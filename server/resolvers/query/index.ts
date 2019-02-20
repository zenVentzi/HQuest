import { Types } from "mongoose";
import { Maybe, QueryResolvers } from "../../generated/gqltypes";
import * as GqlTypes from "../../generated/gqltypes";
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
  const newsfeedDb = await newsfeedService.getNewsfeed(context);
  const newsfeedQuestions = await newsfeedService.getNewsFeedQuestions(
    newsfeedDb,
    context
  );
  const newsfeedUsers = await newsfeedService.getNewsFeedUsers(
    newsfeedDb,
    context
  );

  const gqlNewsfeed = gqlMapper.getNewsfeed(
    newsfeedDb,
    newsfeedUsers,
    newsfeedQuestions,
    context.user!.id
  );

  return gqlNewsfeed;
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

interface Node {
  id: string;
}

interface Edge<NodeT> {
  cursor: string;
  node: NodeT;
}

type GetAllEdges = <NodeT extends Node>(nodes: NodeT[]) => Array<Edge<NodeT>>;
const getAllEdges: GetAllEdges = nodes => {
  return nodes.map(node => {
    const cursor = node.id;
    return {
      cursor,
      node
    };
  });
};

type GetCurrentPageEdges = <NodeT>(
  {
    first,
    after
  }: {
    first: number;
    after?: string | null;
  },
  allEdges: Array<Edge<NodeT>>
) => Array<Edge<NodeT>>;
const getCurrentPageEdges: GetCurrentPageEdges = (
  { first, after },
  allEdges
) => {
  let startIndex = 0;

  if (after) {
    startIndex = allEdges.findIndex(e => e.cursor === after) + 1;
  }

  const endIndex = startIndex + first;
  // console.log(`startIndex ${startIndex}`);
  const res = allEdges.slice(startIndex, endIndex);
  // console.log(`result ${res}`);
  return res;
};

interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

type GetPageInfo = <NodeT>(
  allEdges: Array<Edge<NodeT>>,
  currentPageEdges: Array<Edge<NodeT>>
) => PageInfo;

const getPageInfo: GetPageInfo = (allEdges, currentPageEdges) => {
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
      ObjectId(edge.cursor) < ObjectId(startCursor); // compares by date
    const afterEndCursor = edge => ObjectId(edge.cursor) > ObjectId(endCursor);

    hasPreviousPage = allEdges.filter(beforeStartCursor).length > 0;
    hasNextPage = allEdges.filter(afterEndCursor).length > 0;
  }

  return {
    startCursor,
    endCursor,
    hasPreviousPage,
    hasNextPage,
    no_Idea_Why_Typescript_Allows_that: 5,
    whatever: 6,
    wasted_enough_time_already: 7
  };
};

type RelayConnection = <NodeT extends Node>({
  nodes,
  first,
  after
}: {
  nodes: NodeT[] | null;
  first: number;
  after?: Maybe<string>;
}) => {
  pageInfo: PageInfo;
  edges: Array<Edge<NodeT>>;
  totalCount: number;
} | null;

// todo extract in utils/helper
const relayConnection: RelayConnection = ({ nodes, first, after }) => {
  if (!nodes || !nodes.length) return null;

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
    dbAnswers,
    args.answered,
    context,
    args.tags
  );

  const gqlQuestions = gqlMapper.getQuestions({
    dbQuestions,
    loggedUserId: context.user!.id
  });

  const connection = relayConnection({ nodes: gqlQuestions, ...args });
  return connection;
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
  const res = gqlMapper.getQuestion(context.user!.id, dbQuestion, dbAnswer);

  return res;
};

const users: QueryResolvers.UsersResolver = async (_, args, context) => {
  const dbUsers = await userService.getUsers(args, context);
  const gqlUsers = gqlMapper.getUsers({
    dbUsers,
    loggedUserId: context.user!.id
  });

  return gqlUsers;
};

const user: QueryResolvers.UserResolver = async (_, args, context) => {
  const dbUser = await userService.getUser(args, context);

  if (!dbUser) {
    return null;
  }

  const gqlUser = gqlMapper.getUser(dbUser, context.user!.id);
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
