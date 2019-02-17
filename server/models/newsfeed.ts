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

const DocumentModel = model<Document & { toObject(): string }>("doc");
const docDoc = new DocumentModel();
const doc = docDoc.toObject();

type Bla = { toObject(): any } & { toObject(): number };

const bla: Bla = {
  toObject() {
    return 5;
  }
};

const obj = bla.toObject();
const newsDoc = new NewsfeedModel();
const news = newsDoc.toObject();
const newsfeed = await NewsfeedModel.find().lean() as DbTypes.Newsfeed

switch (news.type) {
  case DbTypes.NewsType.NewFollower:
    news.

  default:
    break;
}

// if(newsfeed.type === DbTypes.NewsType.NewLike) {
//   newsfeed.an
// }
type NewsfeedModel = Model<DbTypes.NewsDoc>;

export { NewsfeedModel };
