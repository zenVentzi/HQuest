const { withFilter } = require('apollo-server');
const { pubsub } = require('../../PubSub');

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
      console.dir(`subscribed!`);
      return pubsub.asyncIterator(`newNotification`);
    },
    (payload, variables) => {
      const holder = 5;

      return payload.receiverId === variables.userId;
    }
  ),
};

module.exports = {
  newNotification,
  bookAdded,
};
