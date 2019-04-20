import { Document, model, Model, Schema, Types as GooseTypes } from "mongoose";
import * as DbTypes from "../dbTypes";
//#region ts-mongoose
// import { createSchema, Type, typedModel } from "ts-mongoose";
// import 'ts-mongoose/plugin'

// const UserSchema = createSchema({
//   name: Type.string()
// });

// const LikerSchema = createSchema({
//   user: Type.string(),
//   numOfLikes: Type.number()
// });

// const LikesSchema = createSchema({
//   total: Type.number(),
//   likers: Type.array().of(Type.schema().of(LikerSchema))
// });

// const CommentSchema = createSchema({
//   value: Type.string(),
//   user: Type.ref(Type.objectId()).to("User", UserSchema),
//   likes: { type: LikesSchema, required: false }
// });

// const EditionSchema = createSchema({
//   date: Type.date(),
//   value: Type.string(),
//   comments: Type.optionalSchema().of(CommentSchema),
//   likes: Type.optionalSchema().of(LikesSchema)
// });

// const AnswerSchema = createSchema({
//   position: Type.number(),
//   userId: Type.string(),
//   questionId: Type.string(),
//   editions: Type.array().of(Type.schema().of(EditionSchema))
// });

// const AnswerModel = typedModel("Answer", AnswerSchema);

// AnswerModel.findById("123").populateTs<number>(5).then(answer => {
//   if (answer) {
//     answer.editions[0].likes!.likers[0].; // autocomplete here
//   }
// });

//#endregion

const LikerSchema = new Schema({ user: String, numOfLikes: Number });
const LikesSchema = new Schema({ total: Number, likers: [LikerSchema] });

const CommentSchema = new Schema({
  value: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  likes: { type: LikesSchema, required: false }
});

const EditionSchema = new Schema({
  date: Date,
  value: { type: String, required: true },
  comments: { type: [CommentSchema], required: false },
  likes: { type: LikesSchema, required: false }
});

const AnswerSchema = new Schema({
  position: { type: Number, required: true },
  userId: { type: String, required: true },
  questionId: { type: String, required: true },
  editions: { type: [EditionSchema], required: true }
});

const AnswerModel = model<DbTypes.AnswerDoc>("Answer", AnswerSchema);
type AnswerModel = Model<DbTypes.AnswerDoc>;

export { AnswerModel };
