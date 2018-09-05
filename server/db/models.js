const mongoose = require('mongoose');
const { getDefaultSchema } = require('./schemas');

const getModels = () => {
  const defaultSchema = getDefaultSchema(mongoose);

  return {
    Book: mongoose.model('Book', defaultSchema),
    User: mongoose.model('User', defaultSchema),
    Question: mongoose.model('Question', defaultSchema),
    Answer: mongoose.model('Answer', defaultSchema),
  };
};

module.exports = { getModels };
