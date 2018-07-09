const http = require('http');
const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const { ApolloServer, makeExecutableSchema } = require('apollo-server');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const jwt = require('express-jwt');
const webpack = require('webpack');
const webpackConfig = require('../webpack/config');
const requireGraphQLFile = require('require-graphql-file');

const typeDefs = requireGraphQLFile('./schema');
const resolvers = require('./resolvers');

const compiler = webpack(webpackConfig);

const PORT = process.env.PORT || 4000;
const app = express();

// app.use(
//   require('webpack-dev-middleware')(compiler, {
//     hot: true,
//     publicPath: webpackConfig.output.publicPath,
//   })
// );

// app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
});

app.use(bodyParser.json(), auth);

const server = new ApolloServer({
  schema,
  context: ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return {};
    }
    return {
      user: req.user,
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

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

// app.listen({ port: 4000 }, () => {
//   console.log(
//     `🚀 Server ready at http://localhost:${4000}${server.graphqlPath}`
//   );
// });
