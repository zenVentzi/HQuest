const util = require('util');

const func = num => (num + 1);

let obj = { a: func(5) };

console.log(util.inspect(obj, { depth: null }));
