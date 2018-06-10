import React, { Fragment } from 'react';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import styled from 'styled-components';
import { AUTH_TOKEN } from '../constants';


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

const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id,
      firstName,
      surName,
      questionIds,
    }
  }`;

const Outer = styled.div`
  display: flex;
  // flex-direction: column;
  // flex-wrap: wrap;
  // margin: 70px auto;
  // align-items: center;
  // text-align: center;
  // width: 500px;
  border: 3px solid red;
  // overflow: hidden;
  `;

const Inner = styled.div`
  // display: flex;
  width: 99%;
  // flex-wrap: nowrap;
  // height: 60px;
  // align-items: center;
  // justify-content: space-around;
  // z-index: 1;
  // border-radius: 0.3em; 
  border: 1px solid black;
`;

const App = () => {
  const test = 5;

  return (
    <ApolloProvider client={client}>
      <Outer>
        <Query
          query={GET_USER}
          variables={{ id: 1 }}
        >
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            return (
              <Fragment>
                <Inner>
                  fdfdfdfdfdfd
                </Inner>
              </Fragment>
            );
          }}
        </Query>
      </Outer>
    </ApolloProvider>
  );
};

export default App;
