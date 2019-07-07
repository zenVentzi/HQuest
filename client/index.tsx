import "@babel/polyfill";
import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./components/App";
import TestApp from "./components/TestApp";

if (module.hot) {
  module.hot.accept();

  // (function(global) {
  //   const console_log = global.console.log;
  //   global.console.log = function() {
  //     if (
  //       !(
  //         arguments.length == 1 &&
  //         typeof arguments[0] === "string" &&
  //         arguments[0].match(/^\[(HMR|WDS)\]/)
  //       )
  //     ) {
  //       console_log.apply(global.console, arguments);
  //     }
  //   };
  // })(window);
}

ReactDOM.render(<App />, document.getElementById("app-root"));
