import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';

import App from './components/App';
import TestApp from './components/TestApp';

ReactDOM.render(<App />, document.getElementById('app'));

// eslint-disable-next-line
injectGlobal`
  body {
    font-family: "Arial Black", Gadget, sans-serif;
  }
`;

