import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Switch>
//         {/* <Route path="/login" component={ProfileView} /> */}
//         {/* <Route path="/signup" component={Signup} /> */}
//       </Switch>
//     </BrowserRouter>
//   );
// };

const App = () => {
  return (
    <input
      type="range"
      disabled
      onMouseEnter={() => {
        console.log(`mouseenter`);
      }}
      onMouseLeave={() => {
        console.log(`mouseleave`);
      }}
    />
  );
};

export default App;
