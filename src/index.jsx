import React from 'react';
import ReactDOM from 'react-dom';
import { injectGlobal } from 'styled-components';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/main/App';
import reducer from './reducers';
import questions from './reducers/Questions';


const store = createStore(questions);
// store.subscribe(() => { console.log(store.getState()); });


ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('app'),
);

// eslint-disable-next-line
injectGlobal`
  body {
    font-family: "Arial Black", Gadget, sans-serif;
  }
`;

