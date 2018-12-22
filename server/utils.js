const fs = require('fs');
const jwt = require('jsonwebtoken');
const { USERS_CONTENT } = require('./constants');

const readDirAsync = async dir =>
  new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

const getAvatarSrcAsync = async userId => {
  const userDir = `${USERS_CONTENT}/${userId}/`;
  let src = '';

  const userFiles = await readDirAsync(userDir);
  userFiles.forEach(file => {
    const fileName = file.split('.')[0];
    if (fileName === 'avatar') {
      src = userDir + file;
    }
  });

  return src;
};

async function getVerifiedUser(authToken) {
  let token = authToken;
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length).trimLeft();
  }
  const secret = process.env.JWT_SECRET;
  return new Promise(resolve => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        // reject(err);
        resolve(null);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = { getAvatarSrcAsync, getVerifiedUser };
