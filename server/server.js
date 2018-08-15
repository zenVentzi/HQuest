const http = require('http');
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const requireGraphQLFile = require('require-graphql-file');
const app = require('./App');
const { connect: mongoConnect } = require('./db');

const collections = require(`./db/collections`);
const resolvers = require('./resolvers');

const typeDefs = requireGraphQLFile('./schema');

const PORT = process.env.PORT || 4000;

mongoConnect(db => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, connection }) => {
      if (connection) {
        // check connection for metadata
        return {};
      }
      return {
        user: req.user,
        collections: collections(db),
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

// const schema = makeExecutableSchema({ typeDefs, resolvers });

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

// app.listen({ port: 4000 }, () => {
//   console.log(
//     `🚀 Server ready at http://localhost:${4000}${server.graphqlPath}`
//   );
// });
