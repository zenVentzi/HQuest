import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const NEW_NOTIFICATION = "NEW_NOTIFICATION";

export { pubsub, NEW_NOTIFICATION };
