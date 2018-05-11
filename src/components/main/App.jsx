import React from 'react';
import Navbar from './Navigation/Navbar';
import Content from './Content';
import baseStyles from './base-styles';

const App = (props) => {
  baseStyles();

  return (
    <div>
      <Navbar />
      <Content />
    </div>
  );
};

export default App;
