const util = require('util');

// console.log(util.inspect({}, { depth: null }));

const mapDispatchToProps = dispatch => ({ a: dispatch });

let neshto = mapDispatchToProps(5);

console.log(neshto.a);
