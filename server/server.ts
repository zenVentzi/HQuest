import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import { writeFileSync } from "fs";
import http from "http";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";
import app from "./App";
import { connect as mongooseConnect } from "./db";
import { createContext, onWebScoketConnect } from "./utils";
dotenv.config();

const typesArray = fileLoader(path.join(__dirname, "./graphql/**/*.graphql"));
const typeDefs: any = mergeTypes(typesArray);
// const typeDefs: any = mergeTypes(typesArray, { all: true });
writeFileSync("server/autoGen.graphql", typeDefs);

const resolversArray = fileLoader(
  path.join(__dirname, "./graphql/**/*resolvers.js")
);

const resolvers = mergeResolvers(resolversArray);

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
