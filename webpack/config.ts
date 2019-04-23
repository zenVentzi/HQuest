import * as path from "path";
import * as webpack from "webpack";
import * as bundleAnalyzer from "webpack-bundle-analyzer";

const { BundleAnalyzerPlugin } = bundleAnalyzer;

const config: webpack.Configuration = {
  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&quiet=true",
    // "babel-polyfill",
    "./src/index.tsx"
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
        loader: "style-loader!css-loader"
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
      Constants: path.resolve(process.cwd(), "./src/constants"),
      Utils: path.resolve(process.cwd(), "./src/utils"),
      // Queries: path.resolve(process.cwd(), './src/gqlQueries'),
      // Mutations: path.resolve(process.cwd(), './src/gqlMutations'),
      // Fragments: path.resolve(process.cwd(), './src/gqlFragments'),
      // Subscriptions: path.resolve(process.cwd(), './src/gqlSubscriptions'),
      Reusable: path.resolve(process.cwd(), "./src/components/reusable"),
      GqlClient: path.resolve(process.cwd(), "./src/graphql")
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
