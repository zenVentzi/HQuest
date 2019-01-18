// const { createError } = require('apollo-errors');
const { AuthenticationError } = require("apollo-server");
import { createResolver } from "./resolverCreator";

const isAuthenticatedResolver = createResolver((root, args, { user }, info) => {
  if (!user) throw new AuthenticationError();
});

const isAdminResolver = isAuthenticatedResolver.createResolver(
  (root, args, { user }, info) => {
    // if (!user.isAdmin) throw new Error("Admin test error");
  }
);

export { isAuthenticatedResolver, isAdminResolver };
