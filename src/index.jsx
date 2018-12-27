import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import TestApp from './components/TestApp';

if (module.hot) {
  module.hot.accept();

  /*eslint-disable */
  (function(global) {
    const console_log = global.console.log;
    global.console.log = function() {
      if (
        !(
          arguments.length == 1 &&
          typeof arguments[0] === "string" &&
          arguments[0].match(/^\[(HMR|WDS)\]/)
        )
      ) {
        console_log.apply(global.console, arguments);
      }
    };
  })(window);
  /* eslint-enable */
}

ReactDOM.render(<App />, document.getElementById('app-root'));
