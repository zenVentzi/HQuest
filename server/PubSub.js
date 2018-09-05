const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

module.exports = {
  pubsub,
  NEW_NOTIFICATION,
};
