const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { graphqlExpress } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const jwt = require('express-jwt');
const webpack = require('webpack');
const webpackConfig = require('../webpack/config');
const requireGraphQLFile = require('require-graphql-file');

const typeDefs = requireGraphQLFile('./schema');
const resolvers = require('./resolvers');

const compiler = webpack(webpackConfig);

const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  require('webpack-dev-middleware')(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
  })
);

app.use(require('webpack-hot-middleware')(compiler));
// app.use(express.static(path.join(process.cwd(), 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
});

app.use(
  '/graphql',
  bodyParser.json(),
  auth,
  graphqlExpress(req => ({
    schema,
    context: {
      user: req.user,
    },
  }))
);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);

  /* eslint-disable no-new */
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server,
      path: '/subscriptions',
    }
  );
});
