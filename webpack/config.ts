import * as path from "path";
import * as webpack from "webpack";
import * as bundleAnalyzer from "webpack-bundle-analyzer";

const { BundleAnalyzerPlugin } = bundleAnalyzer;

const config: webpack.Configuration = {
  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&quiet=true",
    // "babel-polyfill",
    "./client/index.tsx"
    // "./foo.ts"
  ],
  mode: "development",
  output: {
    // path: path.resolve(process.cwd(), 'public'),
    publicPath: "/public",
    filename: "bundle.js",
    libraryTarget: "umd"
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleAnalyzerPlugin({})
  ],
  cache: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }]
        // loader: "style-loader!css-loader",
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      Constants: path.resolve(process.cwd(), "./client/constants"),
      Utils: path.resolve(process.cwd(), "./client/utils"),
      // Queries: path.resolve(process.cwd(), './client/gqlQueries'),
      // Mutations: path.resolve(process.cwd(), './client/gqlMutations'),
      // Fragments: path.resolve(process.cwd(), './client/gqlFragments'),
      // Subscriptions: path.resolve(process.cwd(), './client/gqlSubscriptions'),
      Reusable: path.resolve(process.cwd(), "./client/components/reusable"),
      GqlClient: path.resolve(process.cwd(), "./client/graphql")
    },
    extensions: [
      "*",
      ".mjs",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".css",
      "png",
      "jpg",
      "gif"
    ]
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
    // 'react-router': 'ReactRouter',
  }
};

export default config;
