import { AnswerService } from "./answerService";
import { CommentService } from "./commentService";
import { NewsfeedService } from "./newsfeedService";
import { NotificationService } from "./notificationService";
import { QuestionService } from "./questionService";
import { UserService } from "./userService";
import { models } from "../models";

export interface Services {
  answer: AnswerService;
  comment: CommentService;
  newsfeed: NewsfeedService;
  notification: NotificationService;
  question: QuestionService;
  user: UserService;
}

export const services: Services = {
  answer: new AnswerService(models),
  comment: new CommentService(models),
  newsfeed: new NewsfeedService(models),
  notification: new NotificationService(models),
  question: new QuestionService(models),
  user: new UserService(models)
};
