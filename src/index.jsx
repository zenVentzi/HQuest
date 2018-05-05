import React from 'react';
import ReactDOM from 'react-dom';

function Welcome(props) {
  return <h1>Hello, {props.message}</h1>;
}


ReactDOM.render(
  <Welcome message="Hello!" />,
  document.getElementById('app'),
);
