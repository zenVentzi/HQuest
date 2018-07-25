const fs = require('fs');
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

module.exports = { getAvatarSrcAsync };
