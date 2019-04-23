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
  editionId: String,
  commentId: String,
  followedUserId: String
});

const NewsfeedModel = model<DbTypes.NewsDoc>(
  "newsfeed", // mongoose puts an "s" at the end, this prevents it
  NewsfeedSchema
);

type NewsfeedModel = Model<DbTypes.NewsDoc>;

export { NewsfeedModel };
