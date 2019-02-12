import {
  Document,
  Model,
  Types as GooseTypes,
  DocumentToObjectOptions
} from "mongoose";

// export interface Notification {
//   _id: GooseTypes.ObjectId;
//   type: NotificationType;
//   questionId?: string;
//   commentId?: string;
//   performerId: string;
//   performerAvatarSrc: string;
//   text: string;
//   seen: boolean;
// }

export enum NotificationType {
  NewFollower = "NEW_FOLLOWER",
  NewComment = "NEW_COMMENT"
}

export interface Notification {
  _id: GooseTypes.ObjectId;
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
  _id: GooseTypes.ObjectId;
  firstName: string;
  surName: string;
  email: string;
  intro: string;
  avatarSrc: string;
  followers?: Populated extends true ? User[] : GooseTypes.ObjectId[];
  following?: Populated extends true ? User[] : GooseTypes.ObjectId[];
  notifications?: Notification[];
  socialMediaLinks?: {
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
    linkedInLink?: string;
  };
}

export interface UserDoc extends User, Document {
  _id: GooseTypes.ObjectId;
  toObject<Populated extends boolean = false>(
    options?: DocumentToObjectOptions
  ): User<Populated>;
}

// type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// export type someFunc = () => Omit<User, UserDoc>;

// type Bla = Omit<User, UserDoc>;

export interface Comment {
  _id: GooseTypes.ObjectId;
  value: string;
  user: User | GooseTypes.ObjectId;
}

export interface CommentDoc extends Comment, Document {
  _id: GooseTypes.ObjectId;
  toObject(options?: DocumentToObjectOptions): Comment;
}

export interface Edition {
  _id: GooseTypes.ObjectId;
  date: string;
  before: string;
  after: string;
}

export interface EditionDoc extends Edition, Document {
  _id: GooseTypes.ObjectId;
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
  _id: GooseTypes.ObjectId;
  userId: GooseTypes.ObjectId;
  questionId: GooseTypes.ObjectId;
  value: string;
  position: number;
  comments?: Comment[];
  likes?: Likes;
  editions?: Edition[];
}

export interface AnswerDoc extends Answer, Document {
  _id: GooseTypes.ObjectId;
  toObject(options?: DocumentToObjectOptions): Answer;
}

export interface Question {
  _id: GooseTypes.ObjectId;
  value: string;
  tags: [string];
}

export interface AnsweredQuestion extends Question {
  answer: Answer;
}

export interface QuestionDoc extends Question, Document {
  _id: GooseTypes.ObjectId;
  toObject(options?: DocumentToObjectOptions): Question;
}
