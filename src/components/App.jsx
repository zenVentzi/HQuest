import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import { AUTH_TOKEN } from '../constants';
import Navbar from './navigation';
import SearchView from './searchView';
import ProfileView from './profileView';
import LoginView from './loginView';
import SignUpView from './signUpView';
import baseStyles from './base-styles';

const httpLink = new HttpLink({ uri: '/graphql' });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);

  console.log(`token ${token}`);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: httpLink,
  cache: new InMemoryCache(),
});

const App = () => {
  baseStyles();

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Navbar />
          {/* <Route exact path="/(/|userProfile|)/" component={ProfileView} /> */}
          <Route path="/search" component={SearchView} />
          <Route path="/login" component={LoginView} />
          <Route path="/signup" component={SignUpView} />
        </div>
      </Router>
    </ApolloProvider>
  );
};


export default App;
