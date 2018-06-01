import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import Navbar from './navigation';
import Content from './Content';
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
          <Content />
        </div>
      </Router>
    </ApolloProvider>
  );
};


export default App;
