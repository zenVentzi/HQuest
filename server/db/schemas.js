const getSchemas = mongoose => {
  return {
    defaultSchema: new mongoose.Schema({}, { strict: false }),
  };
};

module.exports = { getSchemas };
