import { AnswerService } from "./answerService";
import { CommentService } from "./commentService";
import { newsfeedService } from "./newsfeedService";
import { notificationService } from "./notificationService";
import { questionService } from "./questionService";
import { userService } from "./userService";
import { models } from "../models";

export interface Services {
  answer: AnswerService;
  comment: CommentService;
}

export const services: Services = {
  answer: new AnswerService(models),
  comment: new CommentService(models)
};

export {
  userService,
  questionService,
  answerService,
  commentService,
  notificationService,
  newsfeedService
};
