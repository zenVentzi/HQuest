import {
  Document,
  MongooseDocument,
  model,
  Model,
  Schema,
  Types as GooseTypes
} from "mongoose";
import * as DbTypes from "../dbTypes";

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  surName: String,
  email: String,
  password: String,
  avatarSrc: String,
  followers: [Schema.Types.ObjectId],
  following: [Schema.Types.ObjectId],
  notifications: []
});

const UserModel = model<DbTypes.UserDoc>("User", UserSchema);

type UserModel = Model<DbTypes.UserDoc>;

export { UserModel };
