const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const webpack = require('webpack');
const webpackConfig = require('../webpack/config');

const compiler = webpack(webpackConfig);

const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
});

const app = express();

app.use(bodyParser.json(), auth);

app.use('/public', express.static('public'));

app.use(
  require('webpack-dev-middleware')(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
  })
); /* The webpack-dev-middleware serves the files emitted from webpack over a connect server and webpack-hot-middleware will allow us to hot reload on Express. */

/* if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.dev.config.js')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
} */

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

module.exports = app;
