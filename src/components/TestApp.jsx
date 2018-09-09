import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Menu from './navigation/Menu';

const App = () => {
  return (
    <BrowserRouter>
      <Menu />
    </BrowserRouter>
  );
};

export default App;
