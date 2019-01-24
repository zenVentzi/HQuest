import { AuthenticationError } from "apollo-server";
import { ApolloContext } from "../types/index";

export const authMiddleware = (cx: ApolloContext) => {
  if (cx.user) return;
  throw new AuthenticationError("Log in required");
};
