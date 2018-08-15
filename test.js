// const { connect: mongoConnect } = require('./server/db');
const { ObjectID } = require('mongodb');

// const getCollections = require(`./server/db/collections`);

// mongoConnect(async db => {
//   const collections = getCollections(db);

//   const answers = await collections.answers
//     .find({
//       userId: `ObjectID('5b682375a23c7306b4a8d81e')`,
//     })
//     .toArray();

//   console.log(answers);
//   // answers.forEach(a => {
//   //   console.log(a);
//   // });
// });

let a = { b: 5 };
a = a.b;

console.log(a);
