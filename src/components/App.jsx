import React from 'react';
import { Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';

import { AUTH_TOKEN } from '../constants';
import { history } from '../utils';
import ProtectedRoute from './reusable/ProtectedRoute';
import SearchView from './searchView';
import ProfileView from './profileView';
import LoginView from './loginView';
import SignUpView from './signUpView';
import baseStyles from './base-styles';

const httpLink = new HttpLink({ uri: '/graphql' });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`));
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = ApolloLink.from([
  errorLink,
  authLink,
  httpLink,
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App = () => {
  baseStyles();

  return (
    <ApolloProvider client={client}>
      <Router history={history}>
        <div>
          <ProtectedRoute exact path="/(/|userProfile|)/" component={ProfileView} />
          <ProtectedRoute path="/search" component={SearchView} />
          <Route path="/login" component={LoginView} />
          <Route path="/signup" component={SignUpView} />
        </div>
      </Router>
    </ApolloProvider>
  );
};


export default App;
