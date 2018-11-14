require('dotenv').config();
const mongoose = require('mongoose');
const { getModels } = require('../db/models');

const mLabURI = `mongodb://zenVentzi:${
  process.env.MLAB_PASS
}@ds149732.mlab.com:49732/hquest`;

const connect = onConnected => {
  mongoose.connect(
    mLabURI,
    { useNewUrlParser: true }
  );

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    const models = getModels(mongoose);
    onConnected(models);
  });
};

module.exports = {
  connect,
};
