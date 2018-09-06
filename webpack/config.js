const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const Visualizer = require('webpack-visualizer-plugin');

const path = require('path');

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&quiet=true',
    'babel-polyfill',
    './src/index.jsx',
  ],
  mode: 'development',
  output: {
    // path: path.resolve(process.cwd(), 'public'),
    publicPath: '/public',
    filename: 'bundle.js',
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    // contentBase: '/',
    overlay: true,
    hot: true,
  },
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
        use: ['babel-loader', 'eslint-loader'],
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
    alias: {
      Utils: path.resolve(process.cwd(), './src/utils'),
      Queries: path.resolve(process.cwd(), './src/gqlQueries'),
      Mutations: path.resolve(process.cwd(), './src/gqlMutations'),
      Fragments: path.resolve(process.cwd(), './src/gqlFragments'),
      Subscriptions: path.resolve(process.cwd(), './src/gqlSubscriptions'),
      Reusable: path.resolve(process.cwd(), './src/components/reusable'),
    },
    extensions: ['*', '.js', '.jsx', '.css', 'png', 'jpg', 'gif'],
  },
};
