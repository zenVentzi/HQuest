import {
  Document,
  model,
  Model,
  MongooseDocument,
  Schema,
  Types as GooseTypes
} from "mongoose";
import * as DbTypes from "../dbTypes";

const NewsfeedSchema = new Schema({
  type: String,
  performerId: String,
  answerOwnerId: String,
  answerId: String,
  followedUserId: String,
  commentId: String
});

const NewsfeedModel = model<DbTypes.NewsDoc>(
  "newsfeed",
  NewsfeedSchema
  // "newsfeed" // mongoose puts s at the end, this prevents it
);

type NewsfeedModel = Model<DbTypes.NewsDoc>;

export { NewsfeedModel };
