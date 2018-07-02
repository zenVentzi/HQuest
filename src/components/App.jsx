import React, { Fragment } from 'react';
import { Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import ApolloClient from './ApolloClient';
import { history } from '../utils';
import ProtectedRoute from './reusable/ProtectedRoute';
import SearchView from './searchView';
import ProfileView from './profileView';
import LoginView from './loginView';
import SignUpView from './signUpView';
import baseStyles from './base-styles';

const App = () => {
  baseStyles();

  return (
    <ApolloProvider client={ApolloClient}>
      <Router history={history}>
        <Fragment>
          <ProtectedRoute
            exact
            path="/userProfile/:id"
            component={ProfileView}
          />
          <ProtectedRoute path="/search" component={SearchView} />
          <Route path="/login" component={LoginView} />
          <Route path="/signup" component={SignUpView} />
        </Fragment>
      </Router>
    </ApolloProvider>
  );
};

export default App;
