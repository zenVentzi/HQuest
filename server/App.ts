import express, { Request, Response, NextFunction } from "express";
import path from "path";
import bodyParser from "body-parser";
import webpack from "webpack";
import { getVerifiedUser } from "./utils";
const webpackConfig = require(process.cwd() + "/webpack/config.js");

const compiler = webpack(webpackConfig);

const app = express();

// app.use(bodyParser.json(), auth);
app.use("/public", express.static("public"));
app.use(
  require("webpack-dev-middleware")(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath
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

app.use(
  require("webpack-hot-middleware")(compiler, {
    log: false
  })
);

// app.get("/graphql", (_, __, next) => {
//   next();
// });

app.get("*", (req: Request, res: Response, next) => {
  if (req.url === "/graphql") {
    next();
  } else {
    res.sendFile(path.join(process.cwd(), "index.html"));
  }
});

export default app;
