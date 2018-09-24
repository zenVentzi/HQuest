import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import { ToastContainer, Zoom } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import ApolloClient from './ApolloClient';
import ProtectedRoute from './reusable/ProtectedRoute';
import AdminView from './adminView';
import SearchView from './searchView';
import ProfileView from './profileView';
import LoginView from './loginView';
import SignUpView from './signUpView';
import NotFoundView from './notFoundView';
import appTheme from './appTheme';
import baseStyles from './base-styles';

const App = () => {
  baseStyles();
  return (
    <ApolloProvider client={ApolloClient}>
      <ThemeProvider theme={appTheme}>
        <BrowserRouter>
          <div>
            <ToastContainer
              hideProgressBar
              position="top-center"
              autoClose={1500}
              transition={Zoom}
            />
            {/* <TestQuestions /> */}
            <Switch>
              <ProtectedRoute path="/userProfile/:id" component={ProfileView} />
              <ProtectedRoute path="/admin" component={AdminView} />
              <ProtectedRoute path="/search" component={SearchView} />
              <Route path="/login" component={LoginView} />
              <Route path="/signup" component={SignUpView} />
              <Route component={NotFoundView} />
            </Switch>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
