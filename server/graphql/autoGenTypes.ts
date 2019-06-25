type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Answer = {
  id: Scalars["ID"];
  position: Scalars["Int"];
  questionId: Scalars["ID"];
  userId: Scalars["ID"];
  editions: Array<AnswerEdition>;
};

export type AnswerEdition = {
  id: Scalars["ID"];
  date: Scalars["DateTime"];
  value: Scalars["String"];
  likes?: Maybe<Likes>;
  comments?: Maybe<Array<Comment>>;
};

export type AnswerEditionLike = Notification & {
  id: Scalars["ID"];
  type: NotificationType;
  performerId: Scalars["ID"];
  performerAvatarSrc: Scalars["String"];
  text: Scalars["String"];
  seen: Scalars["Boolean"];
  createdOn: Scalars["DateTime"];
  userProfileId: Scalars["String"];
  questionId: Scalars["ID"];
  editionId: Scalars["ID"];
};

export type AnswerEditionMention = Notification & {
  id: Scalars["ID"];
  type: NotificationType;
  performerId: Scalars["ID"];
  performerAvatarSrc: Scalars["String"];
  text: Scalars["String"];
  seen: Scalars["Boolean"];
  createdOn: Scalars["DateTime"];
  userProfileId: Scalars["String"];
  questionId: Scalars["ID"];
  editionId: Scalars["ID"];
};

export type AnsweredQuestion = Node & {
  id: Scalars["ID"];
  tags?: Maybe<Array<Scalars["String"]>>;
  value: Scalars["String"];
  answer: Answer;
};

export type AnsweredQuestionConnection = Connection & {
  pageInfo: PageInfo;
  edges?: Maybe<Array<AnsweredQuestionEdge>>;
  totalCount: Scalars["Int"];
};

export type AnsweredQuestionEdge = Edge & {
  cursor: Scalars["String"];
  node: AnsweredQuestion;
};

export type Comment = {
  id: Scalars["ID"];
  user: User;
  value: Scalars["String"];
  likes?: Maybe<Likes>;
};

export type CommentLike = Notification & {
  id: Scalars["ID"];
  type: NotificationType;
  performerId: Scalars["ID"];
  performerAvatarSrc: Scalars["String"];
  text: Scalars["String"];
  seen: Scalars["Boolean"];
  createdOn: Scalars["DateTime"];
  userProfileId: Scalars["String"];
  questionId: Scalars["ID"];
  editionId: Scalars["ID"];
  commentId: Scalars["ID"];
};

export type CommentLikeNews = NewsBase & {
  type: NewsType;
  performer: User;
  answerOwner: User;
  question: AnsweredQuestion;
  editionId: Scalars["ID"];
  commentId: Scalars["ID"];
  createdOn: Scalars["DateTime"];
};

export type Connection = {
  pageInfo: PageInfo;
  edges?: Maybe<Array<Edge>>;
  totalCount: Scalars["Int"];
};

export type Edge = {
  cursor: Scalars["String"];
  node: Node;
};

export type EditionLikeNews = NewsBase & {
  type: NewsType;
  performer: User;
  answerOwner: User;
  question: AnsweredQuestion;
  editionId: Scalars["ID"];
  createdOn: Scalars["DateTime"];
};

export type EditUserInput = {
  fullName: Scalars["String"];
  intro: Scalars["String"];
  socialMediaLinks: SocialMediaLinksInput;
};

export type InputQuestion = {
  value: Scalars["String"];
  tags: Array<Scalars["String"]>;
};

export type Liker = {
  user: User;
  numOfLikes: Scalars["Int"];
};

export type Likes = {
  total: Scalars["Int"];
  likers: Array<Liker>;
};

export type LoginResult = {
  authToken: Scalars["String"];
  user: User;
};

export type Mutation = {
  notifsMarkSeen?: Maybe<Scalars["Boolean"]>;
  commentAnswerEdition: Comment;
  editComment: Comment;
  removeComment: Comment;
  likeComment: Comment;
  editAnswer: Answer;
  addAnswer: Answer;
  removeAnswer: Answer;
  likeAnswerEdition: AnswerEdition;
  moveAnswerPosition?: Maybe<Scalars["Int"]>;
  addQuestions?: Maybe<Scalars["Boolean"]>;
  questionNotApply: UnansweredQuestion;
  signUp?: Maybe<Scalars["String"]>;
  login: LoginResult;
  editUser: User;
  uploadAvatar: Scalars["String"];
  follow?: Maybe<Scalars["Boolean"]>;
};

export type MutationCommentAnswerEditionArgs = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  comment: Scalars["String"];
  mentionedUsers?: Maybe<Array<Scalars["ID"]>>;
};

export type MutationEditCommentArgs = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  commentId: Scalars["ID"];
  commentValue: Scalars["String"];
  mentionedUsers?: Maybe<Array<Scalars["ID"]>>;
};

export type MutationRemoveCommentArgs = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  commentId: Scalars["ID"];
};

export type MutationLikeCommentArgs = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  commentId: Scalars["ID"];
  userLikes: Scalars["Int"];
};

export type MutationEditAnswerArgs = {
  answerId: Scalars["ID"];
  answerValue: Scalars["String"];
  mentionedUsers?: Maybe<Array<Scalars["ID"]>>;
};

export type MutationAddAnswerArgs = {
  questionId: Scalars["ID"];
  answerValue: Scalars["String"];
  mentionedUsers?: Maybe<Array<Scalars["ID"]>>;
};

export type MutationRemoveAnswerArgs = {
  answerId: Scalars["ID"];
};

export type MutationLikeAnswerEditionArgs = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  userLikes: Scalars["Int"];
};

export type MutationMoveAnswerPositionArgs = {
  answerId: Scalars["ID"];
  position: Scalars["Int"];
};

export type MutationAddQuestionsArgs = {
  questions?: Maybe<Array<InputQuestion>>;
};

export type MutationQuestionNotApplyArgs = {
  questionId: Scalars["ID"];
};

export type MutationSignUpArgs = {
  firstName: Scalars["String"];
  surName: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

export type MutationLoginArgs = {
  email: Scalars["String"];
  name: Scalars["String"];
};

export type MutationEditUserArgs = {
  input?: Maybe<EditUserInput>;
};

export type MutationUploadAvatarArgs = {
  base64Img: Scalars["String"];
};

export type MutationFollowArgs = {
  userId: Scalars["ID"];
  follow: Scalars["Boolean"];
};

export type NewAnswerEditionNews = NewsBase & {
  type: NewsType;
  performer: User;
  answerOwner: User;
  question: AnsweredQuestion;
  createdOn: Scalars["DateTime"];
};

export type NewComment = Notification & {
  id: Scalars["ID"];
  type: NotificationType;
  performerId: Scalars["ID"];
  performerAvatarSrc: Scalars["String"];
  text: Scalars["String"];
  seen: Scalars["Boolean"];
  createdOn: Scalars["DateTime"];
  userProfileId: Scalars["String"];
  questionId: Scalars["ID"];
  editionId: Scalars["ID"];
  commentId: Scalars["ID"];
};

export type NewCommentNews = NewsBase & {
  type: NewsType;
  performer: User;
  answerOwner: User;
  question: AnsweredQuestion;
  editionId: Scalars["ID"];
  commentId: Scalars["ID"];
  createdOn: Scalars["DateTime"];
};

export type NewFollower = Notification & {
  id: Scalars["ID"];
  type: NotificationType;
  performerId: Scalars["ID"];
  performerAvatarSrc: Scalars["String"];
  text: Scalars["String"];
  seen: Scalars["Boolean"];
  createdOn: Scalars["DateTime"];
};

export type NewFollowerNews = NewsBase & {
  type: NewsType;
  performer: User;
  followedUser: User;
  createdOn: Scalars["DateTime"];
};

export type News =
  | NewAnswerEditionNews
  | NewCommentNews
  | NewFollowerNews
  | EditionLikeNews
  | CommentLikeNews;

export type NewsBase = {
  type: NewsType;
  performer: User;
  createdOn: Scalars["DateTime"];
};

export enum NewsType {
  NewAnswerEdition = "NEW_ANSWER_EDITION",
  NewComment = "NEW_COMMENT",
  NewFollower = "NEW_FOLLOWER",
  EditionLike = "EDITION_LIKE",
  CommentLike = "COMMENT_LIKE"
}

export type Node = {
  id: Scalars["ID"];
};

export type Notification = {
  id: Scalars["ID"];
  type: NotificationType;
  performerId: Scalars["ID"];
  performerAvatarSrc: Scalars["String"];
  text: Scalars["String"];
  seen: Scalars["Boolean"];
  createdOn: Scalars["DateTime"];
};

export enum NotificationType {
  AnswerEditionLike = "ANSWER_EDITION_LIKE",
  CommentLike = "COMMENT_LIKE",
  NewFollower = "NEW_FOLLOWER",
  NewComment = "NEW_COMMENT",
  CommentMention = "COMMENT_MENTION",
  AnswerEditionMention = "ANSWER_EDITION_MENTION"
}

export type PageInfo = {
  startCursor?: Maybe<Scalars["String"]>;
  endCursor?: Maybe<Scalars["String"]>;
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
};

export type Query = {
  newsfeed?: Maybe<Array<NewsBase>>;
  notifications?: Maybe<Array<Notification>>;
  questionsTags: Array<Scalars["String"]>;
  answeredQuestions?: Maybe<AnsweredQuestionConnection>;
  unansweredQuestions?: Maybe<UnansweredQuestionConnection>;
  answeredQuestion?: Maybe<AnsweredQuestion>;
  users?: Maybe<Array<User>>;
  rankings?: Maybe<Array<User>>;
  user?: Maybe<User>;
  followers?: Maybe<Array<User>>;
  following?: Maybe<Array<User>>;
};

export type QueryAnsweredQuestionsArgs = {
  userId: Scalars["ID"];
  tags?: Maybe<Array<Scalars["String"]>>;
  first: Scalars["Int"];
  after?: Maybe<Scalars["String"]>;
};

export type QueryUnansweredQuestionsArgs = {
  userId: Scalars["ID"];
  tags?: Maybe<Array<Scalars["String"]>>;
  first: Scalars["Int"];
  after?: Maybe<Scalars["String"]>;
};

export type QueryAnsweredQuestionArgs = {
  userId: Scalars["ID"];
  questionId: Scalars["ID"];
};

export type QueryUsersArgs = {
  match?: Maybe<Scalars["String"]>;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type QueryFollowersArgs = {
  userId: Scalars["ID"];
};

export type QueryFollowingArgs = {
  userId: Scalars["ID"];
};

export type SocialMediaLinks = {
  facebookLink?: Maybe<Scalars["String"]>;
  twitterLink?: Maybe<Scalars["String"]>;
  instagramLink?: Maybe<Scalars["String"]>;
  linkedInLink?: Maybe<Scalars["String"]>;
};

export type SocialMediaLinksInput = {
  facebookLink?: Maybe<Scalars["String"]>;
  twitterLink?: Maybe<Scalars["String"]>;
  instagramLink?: Maybe<Scalars["String"]>;
  linkedInLink?: Maybe<Scalars["String"]>;
};

export type Subscription = {
  newNotification: Notification;
};

export type SubscriptionNewNotificationArgs = {
  userId: Scalars["ID"];
};

export type UnansweredQuestion = Node & {
  id: Scalars["ID"];
  tags?: Maybe<Array<Scalars["String"]>>;
  value: Scalars["String"];
};

export type UnansweredQuestionConnection = Connection & {
  pageInfo: PageInfo;
  edges?: Maybe<Array<UnansweredQuestionEdge>>;
  totalCount: Scalars["Int"];
};

export type UnansweredQuestionEdge = Edge & {
  cursor: Scalars["String"];
  node: UnansweredQuestion;
};

export type User = {
  id: Scalars["ID"];
  me?: Maybe<Scalars["Boolean"]>;
  email?: Maybe<Scalars["String"]>;
  fullName: Scalars["String"];
  intro?: Maybe<Scalars["String"]>;
  socialMediaLinks?: Maybe<SocialMediaLinks>;
  avatarSrc?: Maybe<Scalars["String"]>;
  following?: Maybe<Array<Scalars["ID"]>>;
  followers?: Maybe<Array<Scalars["ID"]>>;
  experience: Scalars["Float"];
  role: UserRoles;
};

export enum UserRoles {
  Admin = "ADMIN",
  User = "USER"
}
import { ApolloContext } from "../types/gqlContext";

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>;
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export type AnswerResolvers<Context = ApolloContext, ParentType = Answer> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  position?: Resolver<Scalars["Int"], ParentType, Context>;
  questionId?: Resolver<Scalars["ID"], ParentType, Context>;
  userId?: Resolver<Scalars["ID"], ParentType, Context>;
  editions?: Resolver<Array<AnswerEdition>, ParentType, Context>;
};

export type AnswerEditionResolvers<
  Context = ApolloContext,
  ParentType = AnswerEdition
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  date?: Resolver<Scalars["DateTime"], ParentType, Context>;
  value?: Resolver<Scalars["String"], ParentType, Context>;
  likes?: Resolver<Maybe<Likes>, ParentType, Context>;
  comments?: Resolver<Maybe<Array<Comment>>, ParentType, Context>;
};

export type AnswerEditionLikeResolvers<
  Context = ApolloContext,
  ParentType = AnswerEditionLike
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  type?: Resolver<NotificationType, ParentType, Context>;
  performerId?: Resolver<Scalars["ID"], ParentType, Context>;
  performerAvatarSrc?: Resolver<Scalars["String"], ParentType, Context>;
  text?: Resolver<Scalars["String"], ParentType, Context>;
  seen?: Resolver<Scalars["Boolean"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
  userProfileId?: Resolver<Scalars["String"], ParentType, Context>;
  questionId?: Resolver<Scalars["ID"], ParentType, Context>;
  editionId?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type AnswerEditionMentionResolvers<
  Context = ApolloContext,
  ParentType = AnswerEditionMention
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  type?: Resolver<NotificationType, ParentType, Context>;
  performerId?: Resolver<Scalars["ID"], ParentType, Context>;
  performerAvatarSrc?: Resolver<Scalars["String"], ParentType, Context>;
  text?: Resolver<Scalars["String"], ParentType, Context>;
  seen?: Resolver<Scalars["Boolean"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
  userProfileId?: Resolver<Scalars["String"], ParentType, Context>;
  questionId?: Resolver<Scalars["ID"], ParentType, Context>;
  editionId?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type AnsweredQuestionResolvers<
  Context = ApolloContext,
  ParentType = AnsweredQuestion
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  tags?: Resolver<Maybe<Array<Scalars["String"]>>, ParentType, Context>;
  value?: Resolver<Scalars["String"], ParentType, Context>;
  answer?: Resolver<Answer, ParentType, Context>;
};

export type AnsweredQuestionConnectionResolvers<
  Context = ApolloContext,
  ParentType = AnsweredQuestionConnection
> = {
  pageInfo?: Resolver<PageInfo, ParentType, Context>;
  edges?: Resolver<Maybe<Array<AnsweredQuestionEdge>>, ParentType, Context>;
  totalCount?: Resolver<Scalars["Int"], ParentType, Context>;
};

export type AnsweredQuestionEdgeResolvers<
  Context = ApolloContext,
  ParentType = AnsweredQuestionEdge
> = {
  cursor?: Resolver<Scalars["String"], ParentType, Context>;
  node?: Resolver<AnsweredQuestion, ParentType, Context>;
};

export type CommentResolvers<Context = ApolloContext, ParentType = Comment> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  user?: Resolver<User, ParentType, Context>;
  value?: Resolver<Scalars["String"], ParentType, Context>;
  likes?: Resolver<Maybe<Likes>, ParentType, Context>;
};

export type CommentLikeResolvers<
  Context = ApolloContext,
  ParentType = CommentLike
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  type?: Resolver<NotificationType, ParentType, Context>;
  performerId?: Resolver<Scalars["ID"], ParentType, Context>;
  performerAvatarSrc?: Resolver<Scalars["String"], ParentType, Context>;
  text?: Resolver<Scalars["String"], ParentType, Context>;
  seen?: Resolver<Scalars["Boolean"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
  userProfileId?: Resolver<Scalars["String"], ParentType, Context>;
  questionId?: Resolver<Scalars["ID"], ParentType, Context>;
  editionId?: Resolver<Scalars["ID"], ParentType, Context>;
  commentId?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type CommentLikeNewsResolvers<
  Context = ApolloContext,
  ParentType = CommentLikeNews
> = {
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  answerOwner?: Resolver<User, ParentType, Context>;
  question?: Resolver<AnsweredQuestion, ParentType, Context>;
  editionId?: Resolver<Scalars["ID"], ParentType, Context>;
  commentId?: Resolver<Scalars["ID"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type ConnectionResolvers<
  Context = ApolloContext,
  ParentType = Connection
> = {
  __resolveType: TypeResolveFn<
    "AnsweredQuestionConnection" | "UnansweredQuestionConnection",
    ParentType,
    Context
  >;
  pageInfo?: Resolver<PageInfo, ParentType, Context>;
  edges?: Resolver<Maybe<Array<Edge>>, ParentType, Context>;
  totalCount?: Resolver<Scalars["Int"], ParentType, Context>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<Scalars["DateTime"], any> {
  name: "DateTime";
}

export type EdgeResolvers<Context = ApolloContext, ParentType = Edge> = {
  __resolveType: TypeResolveFn<
    "AnsweredQuestionEdge" | "UnansweredQuestionEdge",
    ParentType,
    Context
  >;
  cursor?: Resolver<Scalars["String"], ParentType, Context>;
  node?: Resolver<Node, ParentType, Context>;
};

export type EditionLikeNewsResolvers<
  Context = ApolloContext,
  ParentType = EditionLikeNews
> = {
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  answerOwner?: Resolver<User, ParentType, Context>;
  question?: Resolver<AnsweredQuestion, ParentType, Context>;
  editionId?: Resolver<Scalars["ID"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type LikerResolvers<Context = ApolloContext, ParentType = Liker> = {
  user?: Resolver<User, ParentType, Context>;
  numOfLikes?: Resolver<Scalars["Int"], ParentType, Context>;
};

export type LikesResolvers<Context = ApolloContext, ParentType = Likes> = {
  total?: Resolver<Scalars["Int"], ParentType, Context>;
  likers?: Resolver<Array<Liker>, ParentType, Context>;
};

export type LoginResultResolvers<
  Context = ApolloContext,
  ParentType = LoginResult
> = {
  authToken?: Resolver<Scalars["String"], ParentType, Context>;
  user?: Resolver<User, ParentType, Context>;
};

export type MutationResolvers<
  Context = ApolloContext,
  ParentType = Mutation
> = {
  notifsMarkSeen?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
  commentAnswerEdition?: Resolver<
    Comment,
    ParentType,
    Context,
    MutationCommentAnswerEditionArgs
  >;
  editComment?: Resolver<Comment, ParentType, Context, MutationEditCommentArgs>;
  removeComment?: Resolver<
    Comment,
    ParentType,
    Context,
    MutationRemoveCommentArgs
  >;
  likeComment?: Resolver<Comment, ParentType, Context, MutationLikeCommentArgs>;
  editAnswer?: Resolver<Answer, ParentType, Context, MutationEditAnswerArgs>;
  addAnswer?: Resolver<Answer, ParentType, Context, MutationAddAnswerArgs>;
  removeAnswer?: Resolver<
    Answer,
    ParentType,
    Context,
    MutationRemoveAnswerArgs
  >;
  likeAnswerEdition?: Resolver<
    AnswerEdition,
    ParentType,
    Context,
    MutationLikeAnswerEditionArgs
  >;
  moveAnswerPosition?: Resolver<
    Maybe<Scalars["Int"]>,
    ParentType,
    Context,
    MutationMoveAnswerPositionArgs
  >;
  addQuestions?: Resolver<
    Maybe<Scalars["Boolean"]>,
    ParentType,
    Context,
    MutationAddQuestionsArgs
  >;
  questionNotApply?: Resolver<
    UnansweredQuestion,
    ParentType,
    Context,
    MutationQuestionNotApplyArgs
  >;
  signUp?: Resolver<
    Maybe<Scalars["String"]>,
    ParentType,
    Context,
    MutationSignUpArgs
  >;
  login?: Resolver<LoginResult, ParentType, Context, MutationLoginArgs>;
  editUser?: Resolver<User, ParentType, Context, MutationEditUserArgs>;
  uploadAvatar?: Resolver<
    Scalars["String"],
    ParentType,
    Context,
    MutationUploadAvatarArgs
  >;
  follow?: Resolver<
    Maybe<Scalars["Boolean"]>,
    ParentType,
    Context,
    MutationFollowArgs
  >;
};

export type NewAnswerEditionNewsResolvers<
  Context = ApolloContext,
  ParentType = NewAnswerEditionNews
> = {
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  answerOwner?: Resolver<User, ParentType, Context>;
  question?: Resolver<AnsweredQuestion, ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type NewCommentResolvers<
  Context = ApolloContext,
  ParentType = NewComment
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  type?: Resolver<NotificationType, ParentType, Context>;
  performerId?: Resolver<Scalars["ID"], ParentType, Context>;
  performerAvatarSrc?: Resolver<Scalars["String"], ParentType, Context>;
  text?: Resolver<Scalars["String"], ParentType, Context>;
  seen?: Resolver<Scalars["Boolean"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
  userProfileId?: Resolver<Scalars["String"], ParentType, Context>;
  questionId?: Resolver<Scalars["ID"], ParentType, Context>;
  editionId?: Resolver<Scalars["ID"], ParentType, Context>;
  commentId?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type NewCommentNewsResolvers<
  Context = ApolloContext,
  ParentType = NewCommentNews
> = {
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  answerOwner?: Resolver<User, ParentType, Context>;
  question?: Resolver<AnsweredQuestion, ParentType, Context>;
  editionId?: Resolver<Scalars["ID"], ParentType, Context>;
  commentId?: Resolver<Scalars["ID"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type NewFollowerResolvers<
  Context = ApolloContext,
  ParentType = NewFollower
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  type?: Resolver<NotificationType, ParentType, Context>;
  performerId?: Resolver<Scalars["ID"], ParentType, Context>;
  performerAvatarSrc?: Resolver<Scalars["String"], ParentType, Context>;
  text?: Resolver<Scalars["String"], ParentType, Context>;
  seen?: Resolver<Scalars["Boolean"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type NewFollowerNewsResolvers<
  Context = ApolloContext,
  ParentType = NewFollowerNews
> = {
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  followedUser?: Resolver<User, ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type NewsResolvers<Context = ApolloContext, ParentType = News> = {
  __resolveType: TypeResolveFn<
    | "NewAnswerEditionNews"
    | "NewCommentNews"
    | "NewFollowerNews"
    | "EditionLikeNews"
    | "CommentLikeNews",
    ParentType,
    Context
  >;
};

export type NewsBaseResolvers<
  Context = ApolloContext,
  ParentType = NewsBase
> = {
  __resolveType: TypeResolveFn<
    | "NewAnswerEditionNews"
    | "NewCommentNews"
    | "NewFollowerNews"
    | "EditionLikeNews"
    | "CommentLikeNews",
    ParentType,
    Context
  >;
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type NodeResolvers<Context = ApolloContext, ParentType = Node> = {
  __resolveType: TypeResolveFn<
    "AnsweredQuestion" | "UnansweredQuestion",
    ParentType,
    Context
  >;
  id?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type NotificationResolvers<
  Context = ApolloContext,
  ParentType = Notification
> = {
  __resolveType: TypeResolveFn<
    | "AnswerEditionLike"
    | "CommentLike"
    | "AnswerEditionMention"
    | "NewComment"
    | "NewFollower",
    ParentType,
    Context
  >;
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  type?: Resolver<NotificationType, ParentType, Context>;
  performerId?: Resolver<Scalars["ID"], ParentType, Context>;
  performerAvatarSrc?: Resolver<Scalars["String"], ParentType, Context>;
  text?: Resolver<Scalars["String"], ParentType, Context>;
  seen?: Resolver<Scalars["Boolean"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type PageInfoResolvers<
  Context = ApolloContext,
  ParentType = PageInfo
> = {
  startCursor?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  endCursor?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  hasNextPage?: Resolver<Scalars["Boolean"], ParentType, Context>;
  hasPreviousPage?: Resolver<Scalars["Boolean"], ParentType, Context>;
};

export type QueryResolvers<Context = ApolloContext, ParentType = Query> = {
  newsfeed?: Resolver<Maybe<Array<NewsBase>>, ParentType, Context>;
  notifications?: Resolver<Maybe<Array<Notification>>, ParentType, Context>;
  questionsTags?: Resolver<Array<Scalars["String"]>, ParentType, Context>;
  answeredQuestions?: Resolver<
    Maybe<AnsweredQuestionConnection>,
    ParentType,
    Context,
    QueryAnsweredQuestionsArgs
  >;
  unansweredQuestions?: Resolver<
    Maybe<UnansweredQuestionConnection>,
    ParentType,
    Context,
    QueryUnansweredQuestionsArgs
  >;
  answeredQuestion?: Resolver<
    Maybe<AnsweredQuestion>,
    ParentType,
    Context,
    QueryAnsweredQuestionArgs
  >;
  users?: Resolver<Maybe<Array<User>>, ParentType, Context, QueryUsersArgs>;
  rankings?: Resolver<Maybe<Array<User>>, ParentType, Context>;
  user?: Resolver<Maybe<User>, ParentType, Context, QueryUserArgs>;
  followers?: Resolver<
    Maybe<Array<User>>,
    ParentType,
    Context,
    QueryFollowersArgs
  >;
  following?: Resolver<
    Maybe<Array<User>>,
    ParentType,
    Context,
    QueryFollowingArgs
  >;
};

export type SocialMediaLinksResolvers<
  Context = ApolloContext,
  ParentType = SocialMediaLinks
> = {
  facebookLink?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  twitterLink?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  instagramLink?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  linkedInLink?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
};

export type SubscriptionResolvers<
  Context = ApolloContext,
  ParentType = Subscription
> = {
  newNotification?: SubscriptionResolver<
    Notification,
    ParentType,
    Context,
    SubscriptionNewNotificationArgs
  >;
};

export type UnansweredQuestionResolvers<
  Context = ApolloContext,
  ParentType = UnansweredQuestion
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  tags?: Resolver<Maybe<Array<Scalars["String"]>>, ParentType, Context>;
  value?: Resolver<Scalars["String"], ParentType, Context>;
};

export type UnansweredQuestionConnectionResolvers<
  Context = ApolloContext,
  ParentType = UnansweredQuestionConnection
> = {
  pageInfo?: Resolver<PageInfo, ParentType, Context>;
  edges?: Resolver<Maybe<Array<UnansweredQuestionEdge>>, ParentType, Context>;
  totalCount?: Resolver<Scalars["Int"], ParentType, Context>;
};

export type UnansweredQuestionEdgeResolvers<
  Context = ApolloContext,
  ParentType = UnansweredQuestionEdge
> = {
  cursor?: Resolver<Scalars["String"], ParentType, Context>;
  node?: Resolver<UnansweredQuestion, ParentType, Context>;
};

export type UserResolvers<Context = ApolloContext, ParentType = User> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  me?: Resolver<Maybe<Scalars["Boolean"]>, ParentType, Context>;
  email?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  fullName?: Resolver<Scalars["String"], ParentType, Context>;
  intro?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  socialMediaLinks?: Resolver<Maybe<SocialMediaLinks>, ParentType, Context>;
  avatarSrc?: Resolver<Maybe<Scalars["String"]>, ParentType, Context>;
  following?: Resolver<Maybe<Array<Scalars["ID"]>>, ParentType, Context>;
  followers?: Resolver<Maybe<Array<Scalars["ID"]>>, ParentType, Context>;
  experience?: Resolver<Scalars["Float"], ParentType, Context>;
  role?: Resolver<UserRoles, ParentType, Context>;
};

export type Resolvers<Context = ApolloContext> = {
  Answer?: AnswerResolvers<Context>;
  AnswerEdition?: AnswerEditionResolvers<Context>;
  AnswerEditionLike?: AnswerEditionLikeResolvers<Context>;
  AnswerEditionMention?: AnswerEditionMentionResolvers<Context>;
  AnsweredQuestion?: AnsweredQuestionResolvers<Context>;
  AnsweredQuestionConnection?: AnsweredQuestionConnectionResolvers<Context>;
  AnsweredQuestionEdge?: AnsweredQuestionEdgeResolvers<Context>;
  Comment?: CommentResolvers<Context>;
  CommentLike?: CommentLikeResolvers<Context>;
  CommentLikeNews?: CommentLikeNewsResolvers<Context>;
  Connection?: ConnectionResolvers;
  DateTime?: GraphQLScalarType;
  Edge?: EdgeResolvers;
  EditionLikeNews?: EditionLikeNewsResolvers<Context>;
  Liker?: LikerResolvers<Context>;
  Likes?: LikesResolvers<Context>;
  LoginResult?: LoginResultResolvers<Context>;
  Mutation?: MutationResolvers<Context>;
  NewAnswerEditionNews?: NewAnswerEditionNewsResolvers<Context>;
  NewComment?: NewCommentResolvers<Context>;
  NewCommentNews?: NewCommentNewsResolvers<Context>;
  NewFollower?: NewFollowerResolvers<Context>;
  NewFollowerNews?: NewFollowerNewsResolvers<Context>;
  News?: NewsResolvers;
  NewsBase?: NewsBaseResolvers;
  Node?: NodeResolvers;
  Notification?: NotificationResolvers;
  PageInfo?: PageInfoResolvers<Context>;
  Query?: QueryResolvers<Context>;
  SocialMediaLinks?: SocialMediaLinksResolvers<Context>;
  Subscription?: SubscriptionResolvers<Context>;
  UnansweredQuestion?: UnansweredQuestionResolvers<Context>;
  UnansweredQuestionConnection?: UnansweredQuestionConnectionResolvers<Context>;
  UnansweredQuestionEdge?: UnansweredQuestionEdgeResolvers<Context>;
  User?: UserResolvers<Context>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<Context = ApolloContext> = Resolvers<Context>;
