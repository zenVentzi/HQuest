import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities';
import introspectionQueryResultData from '../fragmentTypes.json';

import { getAuthToken } from '../utils';

const getHttpURI = isTunnel => {
  return isTunnel
    ? 'http://hquest.localtunnel.me/graphql'
    : 'http://localhost:4000/graphql';
};

const uploadLink = createUploadLink({
  uri: getHttpURI(false),
});

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
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
      console.log(
        `[GraphQL server error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const getWsURI = isTunnel => {
  return isTunnel
    ? `ws://hquest.localtunnel.me/graphql`
    : `ws://localhost:4000/graphql`;
};

const wsLink = new WebSocketLink({
  uri: getWsURI(false),
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getAuthToken(),
    },
  },
});

// to my current knowledge, upload link is a wrapper of http link
const httpLink = ApolloLink.from([errorLink, authLink, uploadLink]);

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink
);

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({ fragmentMatcher }),
});

export default client;
