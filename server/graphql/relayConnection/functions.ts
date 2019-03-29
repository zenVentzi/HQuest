import { Types as GooseTypes } from "mongoose";
import { Node, PageInfo, Edge } from "../autoGenTypes";

const { ObjectId } = GooseTypes;

type CreatePageInfo = <NodeT extends Node>(
  allEdges: Edge[],
  currentPageEdges: Edge[]
) => PageInfo;

const createPageInfo: CreatePageInfo = (allEdges, currentPageEdges) => {
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

type GetAllEdges = <NodeT extends Node>(nodes: NodeT[]) => Edge[];
const getAllEdges: GetAllEdges = nodes => {
  return nodes.map(node => {
    const cursor = node.id;
    return {
      cursor,
      node
    };
  });
};

type GetCurrentPageEdges = <NodeT extends Node>(
  {
    first,
    after
  }: {
    first: number;
    after?: string | null;
  },
  allEdges: Edge[]
) => Edge[];
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

type CreateConnection = <NodeT extends Node>(
  nodes: NodeT[] | null,
  first: number,
  after?: string | null
) => any; // FIXME
// ) => {
//   pageInfo: PageInfo;
//   edges: Edge[];
//   totalCount: number;
// } | null;

const createConnection: CreateConnection = (nodes, first, after) => {
  if (!nodes || !nodes.length) return null;

  const allEdges = getAllEdges(nodes);
  const currentPageEdges = getCurrentPageEdges({ first, after }, allEdges);
  const pageInfo = createPageInfo(allEdges, currentPageEdges);

  const connection = {
    pageInfo,
    edges: currentPageEdges,
    totalCount: allEdges.length
  };
  return connection;
};

export { createConnection };
