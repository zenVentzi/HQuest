import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Menu from './navigation/Menu';
import ProfileView from './profileView';

const TestQuestions = () => {
  const questions = [];

  for (let i = 0; i < 200; i++) {
    questions.push(
      <div key={i}>
        Question
        {i}
      </div>
    );
  }

  return questions;
};

const Login = () => (
  <div>
    <TestQuestions />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={ProfileView} />
        {/* <Route path="/signup" component={Signup} /> */}
      </Switch>
    </BrowserRouter>
  );
};

export default App;
