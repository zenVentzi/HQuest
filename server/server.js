const http = require('http');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const requireGraphQLFile = require('require-graphql-file');
const { getVerifiedUser } = require('./utils');
const app = require('./App');
const { connect: mongooseConnect } = require('./db');

const resolvers = require('./resolvers');

const typeDefs = requireGraphQLFile('./schema');

const PORT = process.env.PORT || 4000;

mongooseConnect(models => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        if (connectionParams.authToken) {
          const verifiedUser = await getVerifiedUser(
            connectionParams.authToken
          );

          return { user: verifiedUser };
        }

        throw new Error('Missing auth token!');
      },
      onDisconnect: () => {
        console.log(`ondisconnect`);
      },
    },
    context: ({ req, connection }) => {
      if (connection) {
        return {
          user: connection.user,
          models,
        };
      }
      return {
        user: req.user,
        models,
      };
    },
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
