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

/* 
User<FollowT extends User[] | ObjectId[] = ObjectId[]> {
  looks is cleaner but creates circular dependency
*/

export interface User<
  PopulatedFields extends
    | "noPopulatedFields"
    | keyof User<"noPopulatedFields"> = "noPopulatedFields"
> {
  _id: ObjectId;
  firstName: string;
  surName: string;
  email: string;
  intro: string;
  avatarSrc: string;
  questionsNotApply?: string[];
  followers?: PopulatedFields extends "followers" ? User[] : ObjectId[];
  following?: PopulatedFields extends "following" ? User[] : ObjectId[];
  notifications?: Notification[];
  socialMediaLinks?: {
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
    linkedInLink?: string;
  };
}

// experiments
// type Populated<T, K extends keyof T> = {
//   [P in keyof T]: P extends K ? null : T[P];
// }

// type PopulatedUser = Populated<User, 'followers' | 'following'>;

// interface Bla<K extends keyof Bla | "" = ""> {
//   field1: K extends "field1" ? string : ObjectId;
//   field2: K extends "field2" ? string : null;
// }
// interface Bla<K extends { populatedFields: keyof Bla } | "" = ""> {
//   field1: K extends { populatedFields: 'field1' } ? string : null;
//   field2: K extends { populatedFields: 'field2' } ? string : null;
// }

// type Bl = Bla<"field1" & "field2">;
// type Bl = Bla<{ populatedFields: "field1" }>;

// const bl: Bl = { field1: "", field2: "" };

// export interface UserUnpopulated extends UserBase {
//   followers?: ObjectId[];
//   following?: ObjectId[];
// }

// export interface UserPopulated {
//   followers?: UserUnpopulated[];
//   following?: UserUnpopulated[];
// }

export interface UserDoc extends User, Document {
  _id: ObjectId;
  toObject<
    PopulatedFields extends
      | "noPopulatedFields"
      | keyof User = "noPopulatedFields"
  >(
    options?: DocumentToObjectOptions
  ): User<PopulatedFields>;
}
// export interface UserPopulatedDoc extends UserPopulated, Document {
//   _id: ObjectId;
//   toObject(options?: DocumentToObjectOptions): UserPopulated;
// }

export interface Comment<UserT extends User | ObjectId = User> {
  _id: ObjectId;
  value: string;
  user: UserT;
}

export interface CommentDoc extends Comment, Document {
  _id: ObjectId;
  toObject<UserT extends User | ObjectId = User>(
    options?: DocumentToObjectOptions
  ): Comment<UserT>;
}

export interface Edition {
  _id: ObjectId;
  date: Date;
  // before: string;
  // after: string;
  value: string;
  comments?: Comment[];
  likes?: Likes;
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
  position: number;
  userId: ObjectId;
  questionId: ObjectId;
  editions: Edition[];
}

export interface AnswerDoc extends Answer, Document {
  _id: ObjectId;
  toObject(options?: DocumentToObjectOptions): Answer;
}

export interface Question {
  _id: ObjectId;
  value: string;
  tags: string[];
  answer?: Answer;
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
