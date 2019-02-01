import { Document, model, Model, Schema, Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";

const AnswerSchema = new Schema({}, { strict: false });
const AnswerModel = model<DbTypes.UserDoc>("Answer", AnswerSchema);
type AnswerModel = Model<DbTypes.Answer>;

export { AnswerModel };
