import {
  Document,
  MongooseDocument,
  model,
  Model,
  Schema,
  Types as GooseTypes
} from "mongoose";
import * as DbTypes from "../dbTypes";

const NEW_FOLLOWER_TYPE = "NEW_FOLLOWER";
const NEW_COMMENT_TYPE = "NEW_COMMENT";

const NotificationSchema = new Schema({
  type: { type: [NEW_FOLLOWER_TYPE, NEW_COMMENT_TYPE], required: true },
  questionId: { type: String, required: false },
  commentId: { type: String, required: false },
  performerId: { type: String, required: true },
  performerAvatarSrc: { type: String, required: true },
  text: { type: String, required: true },
  seen: { type: Boolean, required: true }
});

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  surName: { type: String, required: true },
  email: { type: String, required: true },
  intro: { type: String, required: true },
  avatarSrc: { type: String, required: true },
  questionsNotApply: [String],
  followers: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  following: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  notifications: [NotificationSchema],
  socialMediaLinks: {
    facebookLink: String,
    twitterLink: String,
    instagramLink: String,
    linkedInLink: String,
    required: false
  }
});

const UserModel = model<DbTypes.UserDoc>("User", UserSchema);
type UserModel = Model<DbTypes.UserDoc>;

export { UserModel, UserSchema };
