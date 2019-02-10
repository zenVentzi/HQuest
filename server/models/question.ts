import mongoose from "mongoose";
import { QuestionDoc } from "../dbTypes";

const { ObjectId } = mongoose.SchemaTypes;
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  value: String,
  tags: [String]
});

const QuestionModel = mongoose.model<QuestionDoc>("Question", QuestionSchema);

export { QuestionModel, QuestionSchema };
