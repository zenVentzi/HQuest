// import * as mongoose from "mongoose";
import { Document, model, Model, Schema, Types } from "mongoose";

interface User extends Document {
  firstName: string;
  surName: string;
  email: string;
  password: string;
  avatarSrc: Types.ObjectId;
  followers: [Types.ObjectId];
  following: [Types.ObjectId];
  notifications: [];
}

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

const UserModel = model<User>("User", UserSchema);

type BlaType = Model<User>;

let a: BlaType;

export { UserModel, User };
