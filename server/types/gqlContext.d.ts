import { UserModel } from "../models/user";
import { QuestionModel } from "../models/question";
import { AnswerModel } from "../models/answer";
import { NewsfeedModel } from "../models/newsfeed";
import { Services } from "../services";

interface User {
  id: string;
  email: string;
}

interface ApolloContext {
  user?: User;
  // models: {
  //   // models will be removed
  //   user: UserModel;
  //   question: QuestionModel;
  //   answer: AnswerModel;
  //   newsfeed: NewsfeedModel;
  // };
  services: Services;
}

export { User, ApolloContext };
