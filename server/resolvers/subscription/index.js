const { withFilter } = require('apollo-server');
const { pubsub, NEW_NOTIFICATION } = require('../../PubSub');

const bookAdded = {
  resolve: payload => {
    console.dir('resolver');
    console.dir(payload);
    console.dir('resolver');

    // return {
    //   customData: payload,
    // };

    return payload.bookAdded;
  },
  subscribe: () => {
    console.dir('subscribe called');
    return pubsub.asyncIterator('bookAdded');
  },
};

const newNotification = {
  resolve: payload => payload.notif,
  subscribe: withFilter(
    () => {
      return pubsub.asyncIterator(NEW_NOTIFICATION);
    },
    (payload, variables) => {
      const subscriberId = variables.userId;
      return payload.receiverId === subscriberId;
    }
  ),
};

export default {
  newNotification,
  bookAdded,
};
