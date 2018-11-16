const { test } = require('./testLib');

const test1Func = () => {
  console.log(`test1 func`);
  console.log(test);
};

module.exports = { test1Func };
