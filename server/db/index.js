require('dotenv').config();
const mongoose = require('mongoose');

const mLabURI = `mongodb://zenVentzi:${
  process.env.MLAB_PASS
}@ds149732.mlab.com:49732/hquest`;

const connect = onConnected => {
  mongoose.connect(
    mLabURI,
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
