require('dotenv').config();
const mongoose = require('mongoose');
const { getModels } = require('../db/models');

const atlasDbName = `test`;
// const DbName = `hquest`;

const atlasURI = `mongodb+srv://zenVentzi:${
  process.env.MONGO_ATLAS_PASS
}@cluster0-rsehw.mongodb.net/test?retryWrites=true`;
const mLabURI = `mongodb://zenVentzi:${
  process.env.MLAB_PASS
}@ds149732.mlab.com:49732/hquest`;

/* 
    { useNewUrlParser: true, dbName: DbName }
the obve options are for mAtlas
*/

const connect = onConnected => {
  mongoose.connect(
    mLabURI,
    { useNewUrlParser: true }
  );

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    // const { User, Question, Answer } = getModels(mongoose);
    const models = getModels(mongoose);
    onConnected(models);

    // const pesho = new User({ name: 'Pesho' });

    // pesho.save((err, res) => {
    //   if (err) return console.error(err);
    // });
  });
};

// function connect(onConnected) {
//   const mongoURI = `mongodb+srv://zenVentzi:${
//     process.env.MONGO_PASS
//   }@cluster0-rsehw.mongodb.net/test?retryWrites=true`;

//   MongoClient.connect(
//     mongoURI,
//     { useNewUrlParser: true },
//     (err, client) => {
//       if (err) {
//         console.log(
//           'Error occurred while connecting to MongoDB Atlas...\n',
//           err
//         );
//         return;
//       }
//       console.log('MongoDB Atlas Connected...');
//       onConnected(client.db(DbName));
//       // client.close();
//     }
//   );
// }

module.exports = {
  connect,
};
