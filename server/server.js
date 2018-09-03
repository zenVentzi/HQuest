const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const { ApolloServer } = require('apollo-server');
const { ApolloServer, gql } = require('apollo-server-express');
const requireGraphQLFile = require('require-graphql-file');
const app = require('./App');
const { connect: mongoConnect } = require('./db');

const getCollections = require(`./db/collections`);
const resolvers = require('./resolvers');

const typeDefs = requireGraphQLFile('./schema');

const PORT = process.env.PORT || 4000;

async function verifyToken(authToken) {
  const secret = process.env.JWT_SECRET;
  return new Promise((resolve, reject) => {
    jwt.verify(authToken, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

mongoConnect(db => {
  const collections = getCollections(db);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        if (connectionParams.authToken) {
          const decoded = await verifyToken(connectionParams.authToken);

          return { user: decoded };
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
          collections: getCollections(db),
        };
      }
      return {
        user: req.user,
        collections: getCollections(db),
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
