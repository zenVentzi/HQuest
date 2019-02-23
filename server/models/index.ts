import { AnswerModel } from "./answer";
import { NewsfeedModel } from "./newsfeed";
import { QuestionModel } from "./question";
import { UserModel } from "./user";

export interface Models {
  answer: AnswerModel;
  newsfeed: NewsfeedModel;
  question: QuestionModel;
  user: UserModel;
}

export const models: Models = {
  answer: AnswerModel,
  newsfeed: NewsfeedModel,
  question: QuestionModel,
  user: UserModel
};
