import express, { Request, Response, NextFunction } from "express";
import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig from "../webpack/config";
const compiler = webpack(webpackConfig);

const app = express();

const setupWebpack = () => {
  app.use("/public", express.static("public"));
  app.use(
    webpackDevMiddleware(compiler, {
      // hot: true,
      publicPath: webpackConfig.output!.publicPath!
    })
  );
  /* The webpack-dev-middleware serves the files emitted from webpack
 over a connect server and webpack-hot-middleware will allow
 us to hot reload on Express. */
  app.use(
    webpackHotMiddleware(compiler, {
      log: false
    })
  );
};

if (process.env.NODE_ENV !== "production") {
  setupWebpack();
}

app.get("*", (req: Request, res: Response, next) => {
  if (req.url === "/graphql") {
    next();
  } else {
    res.sendFile(path.join(process.cwd(), "index.html"));
  }
});

export default app;
