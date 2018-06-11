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

module.exports = {
  bookAdded,
};
