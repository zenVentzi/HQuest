import React from 'react';
import Navbar from './navigation';
import Content from './Content';
import baseStyles from './base-styles';

const App = (props) => {
  baseStyles();

  return (
    <div>Hello
      {/* <Navbar />
      <Content /> */}
    </div>
  );
};


export default App;
