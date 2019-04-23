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

import { getAuthToken, deleteLoggedUserData, loginEvent } from "../utils";
import { Middleware, SubscriptionClient } from "subscriptions-transport-ws";

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

      if (error.extensions!.code === "UNAUTHENTICATED") {
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

const wsMiddlewares: Middleware[] = [];

const subscriptionMiddleware: Middleware = {
  applyMiddleware: async (options, next) => {
    // console.log("middlware used");
    options.authToken = getAuthToken();
    next();
  }
};

wsMiddlewares.push(subscriptionMiddleware);

const subClient = new SubscriptionClient(`ws://localhost:4000/graphql`, {
  reconnect: true,
  connectionParams: () => ({
    authToken: getAuthToken()
  })
});

subClient.use([subscriptionMiddleware]);
const wsLink = new WebSocketLink(subClient);

loginEvent.onLogin((authToken, userId) => {
  // forces the ws link to reconnect
  subClient.close(true);
  // console.log(`onlogin apollo client`);
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
