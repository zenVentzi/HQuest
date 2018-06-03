import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import Navbar from './navigation';
import SearchView from './searchView';
import ProfileView from './profileView';
import LoginView from './loginView';
import baseStyles from './base-styles';

const httpLink = new HttpLink({ uri: '/graphql' });

const client = new ApolloClient({
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
        </div>
      </Router>
    </ApolloProvider>
  );
};


export default App;
