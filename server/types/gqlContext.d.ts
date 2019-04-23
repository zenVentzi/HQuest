import { UserModel } from "../models/user";
import { QuestionModel } from "../models/question";
import { AnswerModel } from "../models/answer";
import { NewsfeedModel } from "../models/newsfeed";
import { Services } from "../services";

interface ContextUser {
  id: string;
  email: string;
}

interface ApolloContext {
  user?: ContextUser;
  services: Services;
}

export { ContextUser, ApolloContext };
