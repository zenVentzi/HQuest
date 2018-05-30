const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const cors = require('cors');
const { ApolloServer } = require('apollo-server');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { typeDefs, resolvers } = require('./schema');

const PORT = process.env.PORT || 3000;
const app = express();

const webpack = require('webpack');
const webpackConfig = require('./webpack/config');

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, {
  hot: true,
  publicPath: webpackConfig.output.publicPath,
}));

app.use(require('webpack-hot-middleware')(compiler));
// app.use(express.static(path.join(process.cwd(), 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);

  /* eslint-disable no-new */
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server,
    path: '/subscriptions',
  });
});
