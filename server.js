const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
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
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});
