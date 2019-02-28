import { ApolloClient } from "apollo-client";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { createUploadLink } from "apollo-upload-client";
import {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { getMainDefinition } from "apollo-utilities";
import introspectionQueryResultData from "./fragmentTypes.json";

import { getAuthToken, deleteLoggedUserData } from "../utils";

const uploadLink = createUploadLink({
  uri: "http://localhost:4000/graphql"
});

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(error => {
      // const { name, message, locations, path } = error;
      console.log(error);

      if (error.extensions.code === "UNAUTHENTICATED") {
        deleteLoggedUserData();
        // @ts-ignore
        window.location = "/";
      }
    });
  }

  if (networkError) {
    console.log(`[Network error]: \n`);
    console.log(networkError);
  }
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: getAuthToken()
    }
  }
});

const httpLink = ApolloLink.from([errorLink, authLink, uploadLink]);
const wsocketLink = ApolloLink.from([errorLink, wsLink]);

const link = split(
  // split based on operation type
  ({ query }) => {
    // @ts-ignore
    const { kind, operation } = getMainDefinition(query);
    const shouldUseFirst =
      kind === "OperationDefinition" && operation === "subscription";

    return shouldUseFirst;
  },
  wsocketLink,
  httpLink
);

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({ fragmentMatcher })
});

export default client;
