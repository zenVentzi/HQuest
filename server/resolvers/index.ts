import { IResolvers } from "graphql-tools";

import Query from "./query";
import Mutation from "./mutation";
import Subscription from "./subscription";
import scalars from "./scalars";
import interfaces from "./interfaces";

// it should be IResolvers type but there is bug in graphql-tools package
export const resolvers: any = {
  ...interfaces,
  ...scalars,
  Query,
  Mutation,
  Subscription
};
