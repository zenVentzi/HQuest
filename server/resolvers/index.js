const Query = require('./query');
const Mutation = require('./mutation');
const Subscription = require('./subscription');
const scalars = require('./scalars');
const interfaces = require('./interfaces');

const Notification = {
  __resolveType(obj, context, info) {
    if (obj.type === 'NEW_COMMENT') {
      return 'NewComment';
    }

    return 'NewFollower';
  },
};

module.exports = {
  Notification,
  ...scalars,
  Query,
  Mutation,
  Subscription,
};
