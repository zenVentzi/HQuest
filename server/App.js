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
);

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

module.exports = app;
