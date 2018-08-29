import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import TestApp from './components/TestApp';

if (module.hot) module.hot.accept();

ReactDOM.render(<App />, document.getElementById('app'));
