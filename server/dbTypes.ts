import {
  Document,
  Model,
  Types as GooseTypes,
  DocumentToObjectOptions
} from "mongoose";

export type ObjectId = GooseTypes.ObjectId;

export enum NotificationType {
  NewFollower = "NEW_FOLLOWER",
  NewComment = "NEW_COMMENT"
}

export interface Notification {
  _id: ObjectId;
  type: NotificationType;
  questionId?: string;
  commentId?: string;
  performerId: string;
  performerAvatarSrc: string;
  text: string;
  seen: boolean;
}

export interface NewComment extends Notification {
  type: NotificationType.NewComment;
  questionId: string;
  commentId: string;
}

export interface NewFollower extends Notification {
  type: NotificationType.NewFollower;
}

export interface User<Populated extends boolean = false> {
  _id: ObjectId;
  firstName: string;
  surName: string;
  email: string;
  intro: string;
  avatarSrc: string;
  followers?: Populated extends true ? User[] : ObjectId[];
  following?: Populated extends true ? User[] : ObjectId[];
  notifications?: Notification[];
  socialMediaLinks?: {
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
    linkedInLink?: string;
  };
}

export interface UserDoc extends User, Document {
  _id: ObjectId;
  toObject<Populated extends boolean = false>(
    options?: DocumentToObjectOptions
  ): User<Populated>;
}

// type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// export type someFunc = () => Omit<User, UserDoc>;

// type Bla = Omit<User, UserDoc>;

export interface Comment {
  _id: ObjectId;
  value: string;
  user: User | ObjectId;
}

export interface CommentDoc extends Comment, Document {
  _id: ObjectId;
  toObject(options?: DocumentToObjectOptions): Comment;
}

export interface Edition {
  _id: ObjectId;
  date: string;
  before: string;
  after: string;
}

export interface EditionDoc extends Edition, Document {
  _id: ObjectId;
  toObject(options?: DocumentToObjectOptions): Edition;
}

export interface Liker {
  user: User; // this has to change only to id
  numOfLikes: number;
}

export interface Likes {
  total: number;
  likers: Liker[];
}

export interface Answer {
  _id: ObjectId;
  userId: ObjectId;
  questionId: ObjectId;
  value: string;
  position: number;
  comments?: Comment[];
  likes?: Likes;
  editions?: Edition[];
}

export interface AnswerDoc extends Answer, Document {
  _id: ObjectId;
  toObject(options?: DocumentToObjectOptions): Answer;
}

export interface Question {
  _id: ObjectId;
  value: string;
  tags: string[];
}

export interface AnsweredQuestion extends Question {
  answer: Answer;
}

export interface QuestionDoc extends Question, Document {
  _id: ObjectId;
  toObject(options?: DocumentToObjectOptions): Question;
}

export enum NewsType {
  NewAnswer = "NEW_ANSWER",
  NewAnswerEdition = "NEW_ANSWER_EDITION",
  NewComment = "NEW_COMMENT",
  NewLike = "NEW_LIKE",
  NewFollower = "NEW_FOLLOWER"
}

export interface NewsBase {
  _id: ObjectId;
  type: NewsType;
  performerId: string;
}

export interface AnswerNews extends NewsBase {
  type: NewsType.NewAnswer | NewsType.NewAnswerEdition;
  answerOwnerId: string;
  answerId: string;
  // toObject(options?: DocumentToObjectOptions): AnswerNews;
}

export interface CommentNews extends NewsBase {
  type: NewsType.NewComment;
  answerOwnerId: string;
  answerId: string;
  commentId: string;
  // toObject(options?: DocumentToObjectOptions): CommentNews;
}

export interface NewFollowerNews extends NewsBase {
  type: NewsType.NewFollower;
  followedUserId: string;
  // toObject(options?: DocumentToObjectOptions): NewFollowerNews;
}

export interface NewLikeNews extends NewsBase {
  type: NewsType.NewLike;
  answerOwnerId: string;
  answerId: string;
  // toObject(options?: DocumentToObjectOptions): NewLikeNews;
}

export type News = AnswerNews | CommentNews | NewFollowerNews | NewLikeNews;
export type Newsfeed = News[];

export type NewsDoc = News & {
  _id: ObjectId;
  toObject(options?: DocumentToObjectOptions): News;
} & Document;
