const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const Visualizer = require('webpack-visualizer-plugin');

const path = require('path');

module.exports = {
  entry: ['webpack-hot-middleware/client', 'babel-polyfill', './src/index.jsx'],
  mode: 'development',
  output: {
    // path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    // contentBase: '/',
    overlay: true,
    clientLogLevel: 'warning',
    stats: 'errors-only',
    hot: true,
  },
  // optimization: {
  //   minimize: true,
  // },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new BundleAnalyzerPlugin(),
    new Visualizer(),
  ],
  cache: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css', 'png', 'jpg', 'gif'],
  },
};
