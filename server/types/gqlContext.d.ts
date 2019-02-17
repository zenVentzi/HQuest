import { UserModel } from "../models/user";
import { QuestionModel } from "../models/question";
import { AnswerModel } from "../models/answer";
import { NewsfeedModel } from "../models/newsfeed";

interface User {
  id: string;
  email: string;
}

interface ApolloContext {
  user?: User;
  models: {
    user: UserModel;
    question: QuestionModel;
    answer: AnswerModel;
    newsfeed: NewsfeedModel;
  };
  // services: {
  //   answer: any;
  //   comment: any;
  //   newsfeed: any;
  //   notification: any;
  //   question: any;
  //   user: any;
  // };
}

export { User, ApolloContext };
