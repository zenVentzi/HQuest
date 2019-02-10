import { Document, model, Model, Schema, Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";
import { UserSchema } from "./user";

const CommentSchema = new Schema({
  value: String,
  user: { type: Schema.Types.ObjectId, ref: "User" }
});

const LikerSchema = new Schema({ user: UserSchema, numOfLikes: Number });

const LikesSchema = new Schema({ total: Number, likers: [LikerSchema] });

const EditionSchema = new Schema({ date: Date, before: String, after: String });

const AnswerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  questionId: { type: Schema.Types.ObjectId, required: true },
  value: { type: String, required: true },
  position: { type: Number, required: true },
  comments: { type: [CommentSchema], required: false },
  likes: { type: LikesSchema, required: false },
  editions: { type: [EditionSchema], required: false }
});

const AnswerModel = model<DbTypes.AnswerDoc>("Answer", AnswerSchema);
type AnswerModel = Model<DbTypes.AnswerDoc>;

export { AnswerModel };
