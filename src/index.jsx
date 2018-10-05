import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import baseStyles from './components/base-styles';

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
          typeof arguments[0] === 'string' &&
          arguments[0].match(/^\[(HMR|WDS)\]/)
        )
      ) {
        console_log.apply(global.console, arguments);
      }
    };
  })(window);
  /* eslint-enable */
}

baseStyles();

ReactDOM.render(<App />, document.getElementById('app'));

// import React from 'react';
// import ReactDOM from 'react-dom';
// import baseStyles from './components/base-styles';

// function App() {
//   return (
//     <div>
//       <h1>Hello CodeSandbox</h1>
//       <input
//         type="range"
//         onMouseEnter={() => {
//           console.log(`mouseenter`);
//         }}
//         onMouseLeave={() => {
//           console.log(`mouseleave`);
//         }}
//       />
//       <h2>Start editing to see some magic happen!</h2>
//     </div>
//   );
// }

// baseStyles();

// const rootElement = document.getElementById('app');
// ReactDOM.render(<App />, rootElement);
