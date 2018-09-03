const { getSchemas } = require('./schemas');

const getModels = mongoose => {
  const { defaultSchema } = getSchemas(mongoose);

  return {
    Book: mongoose.model('Book', defaultSchema),
    User: mongoose.model('User', defaultSchema),
    Question: mongoose.model('Question', defaultSchema),
    Answer: mongoose.model('Answer', defaultSchema),
  };
};

module.exports = { getModels };
