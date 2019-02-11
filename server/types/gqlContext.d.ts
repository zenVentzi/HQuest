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
    newsfeed: any;
  };
}

export { User, ApolloContext };
