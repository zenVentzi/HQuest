require('dotenv').config();
const mongoose = require('mongoose');
const { getModels } = require('./server/db/models');

const atlasURI = `mongodb+srv://zenVentzi:${
  process.env.MONGO_PASS
}@cluster0-rsehw.mongodb.net/test?retryWrites=true`;

mongoose.connect(
  atlasURI,
  { useNewUrlParser: true, dbName: 'test' }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  const { User, Question, Answer } = getModels(mongoose);
  const pesho = new User({ name: 'Pesho' });

  pesho.save((err, res) => {
    if (err) return console.error(err);
  });
});
