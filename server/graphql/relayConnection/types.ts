export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Node {
  id: string;
}

export interface Edge<NodeT extends Node> {
  cursor: string;
  node: NodeT;
}

export interface Connection<NodeT extends Node> {
  pageInfo: PageInfo;
  edges: Array<Edge<NodeT>>;
  totalCount: number;
}
