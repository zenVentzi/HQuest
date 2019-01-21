// import * as mongoose from "mongoose";
import { Document, model, Model, Schema, Types as GooseTypes } from "mongoose";

namespace Types {
  export interface User extends Document {
    firstName: string;
    surName: string;
    email: string;
    password: string;
    avatarSrc: GooseTypes.ObjectId;
    followers: [GooseTypes.ObjectId];
    following: [GooseTypes.ObjectId];
    notifications: [];
  }

  export type UserModel = Model<User>;
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

const UserModel: Model<Types.User> = model<Types.User>("User", UserSchema);

export { UserModel, Types };
