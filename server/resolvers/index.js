const Query = require('./query');
const Mutation = require('./mutation');
const Subscription = require('./subscription');
const scalars = require('./scalars');
const interfaces = require('./interfaces');

module.exports = {
  ...interfaces,
  ...scalars,
  Query,
  Mutation,
  Subscription,
};
