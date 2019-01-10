const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;
const { Schema } = mongoose;

const NewsfeedSchema = new Schema({}, { strict: false });

// const UserSchema = new Schema({
//   firstName: { type: String, required: true },
//   surName: String,
//   email: String,
//   password: String,
//   avatarSrc: String,
//   followers: [ObjectId],
//   following: [ObjectId],
//   notifications: [],
// });

const NewsfeedModel = mongoose.model('Newsfeed', NewsfeedSchema);

module.exports = { NewsfeedModel };
