import {
  Document,
  Model,
  Types as GooseTypes,
  DocumentToObjectOptions
} from "mongoose";
import { NotificationType, NewsType } from "./graphql/autoGenTypes";

export { NotificationType, NewsType };

// const a: bla = bla.
export type ObjectId = GooseTypes.ObjectId;

export interface Notification {
  _id: ObjectId;
  type: NotificationType;
  performerId: string;
  performerAvatarSrc: string | undefined;
  text: string;
  seen: boolean;
}

export type AnswerEditionLike = Notification & {
  type: NotificationType.AnswerEditionLike;
  userProfileId: string;
  questionId: string;
  editionId: string;
};

export interface CommentLike extends Notification {
  type: NotificationType.CommentLike;
  userProfileId: string;
  questionId: string;
  editionId: string;
  commentId: string;
}

export type AnswerEditionMention = Notification & {
  type: NotificationType.AnswerEditionMention;
  userProfileId: string;
  questionId: string;
  editionId: string;
};

export interface NewComment extends Notification {
  type: NotificationType.NewComment | NotificationType.CommentMention;
  userProfileId: string;
  questionId: string;
  editionId: string;
  commentId: string;
}

export interface NewFollower extends Notification {
  type: NotificationType.NewFollower;
}

export enum UserPopulatedFields {
  followers = "followers",
  following = "following",
  none = "none"
}

export enum UserRoles {
  Admin = "ADMIN",
  User = "USER"
}

export interface User<
  PopulatedFields extends UserPopulatedFields = UserPopulatedFields.none
> {
  _id: ObjectId;
  firstName: string;
  surName: string;
  email: string;
  intro: string;
  avatarSrc?: string;
  questionsNotApply?: string[];
  followers?: PopulatedFields extends UserPopulatedFields.followers
    ? User[]
    : ObjectId[];
  following?: PopulatedFields extends UserPopulatedFields.following
    ? User[]
    : ObjectId[];
  notifications?: Notification[];
  socialMediaLinks?: {
    facebookLink?: string;
    twitterLink?: string;
    instagramLink?: string;
    linkedInLink?: string;
  };
  experience: number;
  role: UserRoles;
}

export interface UserDoc extends User, Document {
  _id: ObjectId;
  toObject<
    PopulatedFields extends UserPopulatedFields = UserPopulatedFields.none
  >(
    options?: DocumentToObjectOptions
  ): User<PopulatedFields>;
}

export interface Comment<
  PopulatedFields extends string = AnswerPopulatedFields.editions_comments_user &
    AnswerPopulatedFields.editions_comments_likes_likers_user
> {
  _id: ObjectId;
  value: string;
  user: PopulatedFields extends AnswerPopulatedFields.editions_comments_user
    ? User
    : ObjectId;
  likes?: CommentLikes<PopulatedFields>;
}

export interface CommentDoc extends Comment, Document {
  _id: ObjectId;
  toObject<
    PopulatedFields extends string = AnswerPopulatedFields.editions_comments_user &
      AnswerPopulatedFields.editions_comments_likes_likers_user
  >(
    options?: DocumentToObjectOptions
  ): Comment<PopulatedFields>;
}

export interface Edition<
  PopulatedFields extends string = AnswerPopulatedFields.editions_likes_likers_user &
    AnswerPopulatedFields.editions_comments_user &
    AnswerPopulatedFields.editions_comments_likes_likers_user
> {
  _id: ObjectId;
  date: Date;
  value: string;
  comments?: Array<Comment<PopulatedFields>>;
  likes?: EditionLikes<PopulatedFields>;
}

export interface EditionDoc extends Edition, Document {
  _id: ObjectId;
  toObject<
    PopulatedFields extends string = AnswerPopulatedFields.editions_likes_likers_user &
      AnswerPopulatedFields.editions_comments_user &
      AnswerPopulatedFields.editions_comments_likes_likers_user
  >(
    options?: DocumentToObjectOptions
  ): Edition<PopulatedFields>;
}
export interface CommentLiker<
  PopulatedFields extends string = AnswerPopulatedFields.editions_comments_likes_likers_user
> {
  user: PopulatedFields extends AnswerPopulatedFields.editions_comments_likes_likers_user
    ? User
    : ObjectId;
  numOfLikes: number;
}
export interface EditionLiker<
  PopulatedFields extends string = AnswerPopulatedFields.editions_likes_likers_user
> {
  user: PopulatedFields extends AnswerPopulatedFields.editions_likes_likers_user
    ? User
    : ObjectId;
  numOfLikes: number;
}

export interface CommentLikes<
  PopulatedFields extends string = AnswerPopulatedFields.editions_comments_likes_likers_user
> {
  total: number;
  likers: Array<CommentLiker<PopulatedFields>>;
}
export interface EditionLikes<
  PopulatedFields extends string = AnswerPopulatedFields.editions_likes_likers_user
> {
  total: number;
  likers: Array<EditionLiker<PopulatedFields>>;
}

export enum AnswerPopulatedFields {
  editions_likes_likers_user = "editions.likes.likers.user",
  editions_comments_user = "editions.comments.user",
  editions_comments_likes_likers_user = "editions.comments.likes.likers.user",
  none = "none"
}

export interface Answer<
  PopulatedFields extends AnswerPopulatedFields = AnswerPopulatedFields.editions_comments_user &
    AnswerPopulatedFields.editions_likes_likers_user &
    AnswerPopulatedFields.editions_comments_likes_likers_user
> {
  _id: ObjectId;
  position: number;
  userId: string;
  questionId: string;
  editions: Array<Edition<PopulatedFields>>;
}

export interface AnswerDoc<
  PopulatedFields extends AnswerPopulatedFields = AnswerPopulatedFields.editions_comments_user &
    AnswerPopulatedFields.editions_likes_likers_user &
    AnswerPopulatedFields.editions_comments_likes_likers_user
> extends Answer<PopulatedFields>, Document {
  _id: ObjectId;
  toObject<
    PopulatedFieldss extends AnswerPopulatedFields = AnswerPopulatedFields.editions_comments_user &
      AnswerPopulatedFields.editions_likes_likers_user &
      AnswerPopulatedFields.editions_comments_likes_likers_user
  >(
    options?: DocumentToObjectOptions
  ): Answer<PopulatedFieldss>;
}

interface Question {
  _id: ObjectId;
  value: string;
  tags: string[];
  answer?: Answer;
}

export interface AnsweredQuestion extends Question {
  answer: Answer;
}
export interface UnansweredQuestion extends Question {}

export interface QuestionDoc extends Question, Document {
  _id: ObjectId;
  toObject(options?: DocumentToObjectOptions): Question;
}

// export enum NewsType {
//   NewAnswer = "NEW_ANSWER",
//   NewAnswerEdition = "NEW_ANSWER_EDITION",
//   NewComment = "NEW_COMMENT",
//   NewLike = "NEW_LIKE",
//   NewFollower = "NEW_FOLLOWER"
// }

export interface NewsBase {
  _id: ObjectId;
  type: NewsType;
  performerId: string;
}

export interface NewAnswerEditionNews extends NewsBase {
  type: NewsType.NewAnswerEdition;
  answerOwnerId: string;
  answerId: string;
  // toObject(options?: DocumentToObjectOptions): AnswerNews;
}

export interface NewCommentNews extends NewsBase {
  type: NewsType.NewComment;
  answerOwnerId: string;
  answerId: string;
  editionId: string;
  commentId: string;
  // toObject(options?: DocumentToObjectOptions): CommentNews;
}

export interface NewFollowerNews extends NewsBase {
  type: NewsType.NewFollower;
  followedUserId: string;
  // toObject(options?: DocumentToObjectOptions): NewFollowerNews;
}

export interface EditionLikeNews extends NewsBase {
  type: NewsType.EditionLike;
  answerOwnerId: string;
  answerId: string;
  editionId: string;
}
export interface CommentLikeNews extends NewsBase {
  type: NewsType.CommentLike;
  answerOwnerId: string;
  answerId: string;
  editionId: string;
  commentId: string;
}

export const isCommentLikeNews = (
  news: EditionLikeNews | CommentLikeNews
): news is CommentLikeNews => {
  return (news as CommentLikeNews).commentId !== undefined;
};

export type News =
  | NewAnswerEditionNews
  | NewCommentNews
  | NewFollowerNews
  | EditionLikeNews
  | CommentLikeNews;
export type Newsfeed = News[];

export type NewsDoc = News & {
  _id: ObjectId;
  toObject(options?: DocumentToObjectOptions): News;
} & Document;
