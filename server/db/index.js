const bcrypt = require('bcrypt');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const { getModels } = require('../db/models');

// const DbName = `test`;
const DbName = `hquest`;

const atlasURI = `mongodb+srv://zenVentzi:${
  process.env.MONGO_PASS
}@cluster0-rsehw.mongodb.net/test?retryWrites=true`;

// const connect = onConnected => {
//   mongoose.connect(
//     atlasURI,
//     { useNewUrlParser: true, dbName: DbName }
//   );

//   const db = mongoose.connection;
//   db.on('error', console.error.bind(console, 'connection error:'));
//   db.once('open', () => {
//     // const { User, Question, Answer } = getModels(mongoose);
//     const models = getModels(mongoose);
//     onConnected(models);

//     // const pesho = new User({ name: 'Pesho' });

//     // pesho.save((err, res) => {
//     //   if (err) return console.error(err);
//     // });
//   });
// };

function connect(onConnected) {
  const mongoURI = `mongodb+srv://zenVentzi:${
    process.env.MONGO_PASS
  }@cluster0-rsehw.mongodb.net/test?retryWrites=true`;

  MongoClient.connect(
    mongoURI,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) {
        console.log(
          'Error occurred while connecting to MongoDB Atlas...\n',
          err
        );
        return;
      }
      console.log('MongoDB Atlas Connected...');
      onConnected(client.db(DbName));
      // client.close();
    }
  );
}

module.exports = {
  connect,
};
