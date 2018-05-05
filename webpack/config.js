// const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  mode: 'development',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  watch: true,
};
