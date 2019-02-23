import { ApolloContext, ContextUser } from "gqlContext";
import { AuthenticationError } from "apollo-server";

type LoggedUser = Required<ContextUser>;

function authMiddleware(user?: ContextUser): user is LoggedUser {
  if (!user) {
    throw new AuthenticationError("Resolver requires login");
  }

  return true;
}

export { authMiddleware };
