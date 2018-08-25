const Query = require('./query');
const Mutation = require('./mutation');
const Subscription = require('./subscription');
const scalars = require('./scalars');

module.exports = {
  ...scalars,
  Query,
  Mutation,
  Subscription,
};
