import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import http from "http";
import requireGraphQLFile from "require-graphql-file";
import app from "./App";
import { connect as mongooseConnect } from "./db";
import { resolvers } from "./resolvers";
import { getVerifiedUser, onWebScoketConnect, createContext } from "./utils";

dotenv.config();

const typeDefs = requireGraphQLFile("./schema");

const PORT = process.env.PORT || 4000;

mongooseConnect(() => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      onConnect: onWebScoketConnect
    },
    context: createContext
  });
  server.applyMiddleware({ app });

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${
        server.subscriptionsPath
      }`
    );
  });
});
