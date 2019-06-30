require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

const connect = onConnected => {
  mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, reconnectTries: 100, reconnectInterval: 2000 }
  );

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    onConnected();
  });
};

module.exports = {
  connect,
};
