import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { Theme } from '@atlaskit/theme';

import ApolloClient from './ApolloClient';
import ProtectedRoute from './reusable/ProtectedRoute';
import AdminView from './adminView';
import SearchView from './searchView';
import ProfileView from './profileView';
import LoginView from './loginView';
import SignUpView from './signUpView';
import appTheme from './appTheme';
import baseStyles from './base-styles';

const App = () => {
  baseStyles();
  return (
    <ApolloProvider client={ApolloClient}>
      <Theme values={appTheme}>
        <BrowserRouter>
          <Switch>
            <ProtectedRoute path="/userProfile/:id" component={ProfileView} />
            <ProtectedRoute path="/admin" component={AdminView} />
            <ProtectedRoute path="/search" component={SearchView} />
            <Route path="/login" component={LoginView} />
            <Route path="/signup" component={SignUpView} />
          </Switch>
        </BrowserRouter>
      </Theme>
    </ApolloProvider>
  );
};

export default App;
