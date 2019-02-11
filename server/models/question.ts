import mongoose, { Model } from "mongoose";
import * as DbTypes from "../dbTypes";

const { ObjectId } = mongoose.SchemaTypes;
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  value: String,
  tags: [String]
});

const QuestionModel = mongoose.model<DbTypes.QuestionDoc>(
  "Question",
  QuestionSchema
);
type QuestionModel = Model<DbTypes.QuestionDoc>;

export { QuestionModel, QuestionSchema };
