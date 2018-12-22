const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const getDefaultSchema = () => new mongoose.Schema({}, { strict: false });
const getUserSchema = () =>
  new mongoose.Schema({
    firstName: { type: String, required: true },
    surName: String,
    email: String,
    password: String,
    avatarSrc: String,
    followers: [ObjectId],
    following: [ObjectId],
    notifications: [],
  });
const getAnswerSchema = () => new mongoose.Schema({});
const getQuestionSchema = () => new mongoose.Schema({});

module.exports = { getDefaultSchema };
