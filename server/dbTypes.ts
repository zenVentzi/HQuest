import {
  Document,
  Model,
  Types as GooseTypes,
  DocumentToObjectOptions
} from "mongoose";

export type ObjectId = GooseTypes.ObjectId;

export enum NotificationType {
  NewFollower = "NEW_FOLLOWER",
  NewComment = "NEW_COMMENT",
  CommentMention = "COMMENT_MENTION",
  AnswerEditionMention = "ANSWER_EDITION_MENTION"
}

// try to remove commentId, questionId etc from the general Notification interface
export interface Notification {
  _id: ObjectId;
  type: NotificationType;
  // userProfileId?: string;
  // questionId?: string;
  // commentId?: string;
  performerId: string;
  performerAvatarSrc: string;
  text: string;
  seen: boolean;
}

export type AnswerEditionMention = Notification & {
  type: NotificationType.AnswerEditionMention;
  userProfileId: string;
  questionId: string;
};

export interface NewComment extends Notification {
  type: NotificationType.NewComment | NotificationType.CommentMention;
  userProfileId: string;
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

export enum UserPopulatedFields {
  followers = "followers",
  following = "following",
  none = "none"
}

export interface User<
  PopulatedFields extends UserPopulatedFields = UserPopulatedFields.none
> {
  _id: ObjectId;
  firstName: string;
  surName: string;
  email: string;
  intro: string;
  avatarSrc: string;
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
}

export interface UserDoc extends User, Document {
  _id: ObjectId;
  toObject<
    PopulatedFields extends UserPopulatedFields = UserPopulatedFields.none
  >(
    options?: DocumentToObjectOptions
  ): User<PopulatedFields>;
}

export enum CommentPopulatedFields {
  user = "editions.comments.user",
  none = "none"
}

export interface Comment<
  PopulatedFields extends CommentPopulatedFields = CommentPopulatedFields.user
> {
  _id: ObjectId;
  value: string;
  user: PopulatedFields extends CommentPopulatedFields.user ? User : ObjectId;
}

export interface CommentDoc extends Comment, Document {
  _id: ObjectId;
  toObject<
    PopulatedFields extends CommentPopulatedFields = CommentPopulatedFields.user
  >(
    options?: DocumentToObjectOptions
  ): Comment<PopulatedFields>;
}

export enum EditionPopulatedFields {
  comments_user,
  none
}

export interface Edition<
  PopulatedFields extends EditionPopulatedFields = EditionPopulatedFields.comments_user
> {
  _id: ObjectId;
  date: Date;
  // before: string;
  // after: string;
  value: string;
  comments?: PopulatedFields extends EditionPopulatedFields.comments_user
    ? Array<Comment<CommentPopulatedFields.user>>
    : Array<Comment<CommentPopulatedFields.none>>;
  likes?: Likes;
}

export interface EditionDoc extends Edition, Document {
  _id: ObjectId;
  toObject<
    PopulatedFields extends EditionPopulatedFields = EditionPopulatedFields.comments_user
  >(
    options?: DocumentToObjectOptions
  ): Edition<PopulatedFields>;
}

export interface Liker {
  user: User; // this has to change only to id
  numOfLikes: number;
}

export interface Likes {
  total: number;
  likers: Liker[];
}

export enum AnswerPopulatedFields {
  editions_comments_user = "editions.comments.user",
  none = "none"
}

export interface Answer<
  PopulatedFields extends AnswerPopulatedFields = AnswerPopulatedFields.editions_comments_user
> {
  _id: ObjectId;
  position: number;
  userId: string;
  questionId: string;
  editions: PopulatedFields extends AnswerPopulatedFields.editions_comments_user
    ? Array<Edition<EditionPopulatedFields.comments_user>>
    : Array<Edition<EditionPopulatedFields.none>>;
}

export interface AnswerDoc<
  PopulatedFields extends AnswerPopulatedFields = AnswerPopulatedFields.editions_comments_user
> extends Answer<PopulatedFields>, Document {
  _id: ObjectId;
  toObject<
    PopulatedFieldss extends AnswerPopulatedFields = AnswerPopulatedFields.editions_comments_user
  >(
    options?: DocumentToObjectOptions
  ): Answer<PopulatedFieldss>;
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
