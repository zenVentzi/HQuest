const mongoose = require('mongoose');
const { getDefaultSchema } = require('./schemas');

const getModels = () => {
  const defaultSchema = getDefaultSchema(mongoose);

  return {
    Book: mongoose.model('Book', defaultSchema),
    User: mongoose.model('User', defaultSchema),
    Question: mongoose.model('Question', defaultSchema),
    Answer: mongoose.model('Answer', defaultSchema),
    Newsfeed: mongoose.model('Newsfeed', defaultSchema),
  };
};

module.exports = { getModels };

/* 

import { validateUsername } from './validate';
const userSchema = new Schema({
  username: { 
    type: String, 
    unique: true,
    validate: [{ validator: validateUsername, msg: 'Invalid username' }],
  },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;

*/
