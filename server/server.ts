import { Request } from "express";
import http from "http";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import requireGraphQLFile from "require-graphql-file";
import { getVerifiedUser } from "./utils";
import app from "./App";
import { connect as mongooseConnect } from "./db";
import { resolvers } from "./resolvers";
dotenv.config();

const typeDefs = requireGraphQLFile("./schema");

const PORT = process.env.PORT || 4000;

interface ConnectionParams {
  authToken?: string;
}

mongooseConnect(() => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      onConnect: async (connectionParams: ConnectionParams, webSocket) => {
        if (!connectionParams.authToken) return {};
        const verifiedUser = await getVerifiedUser(connectionParams.authToken);
        return { user: verifiedUser };
      },
      onDisconnect: () => {
        console.log(`ondisconnect`);
      }
    },
    context: ({ req, connection }: { req: Request; connection: any }) => {
      if (connection) {
        return {
          user: connection.context.user,
          // the below is just for testing
          isFromConnection: true
        };
      }
      return {
        user: req.user
      };
    }
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
