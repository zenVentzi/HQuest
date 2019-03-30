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

export type AnswerNews = NewsBase & {
  type: NewsType;
  performer: User;
  answerOwner: User;
  question: Question;
  createdOn: Scalars["DateTime"];
};

export type Comment = {
  id: Scalars["ID"];
  user: User;
  value: Scalars["String"];
};

export type CommentNews = NewsBase & {
  type: NewsType;
  performer: User;
  answerOwner: User;
  question: Question;
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
  userId: Scalars["ID"];
};

export type Mutation = {
  notifsMarkSeen?: Maybe<Scalars["Boolean"]>;
  commentAnswerEdition: Comment;
  editComment: Comment;
  removeComment: Comment;
  editAnswer: Answer;
  addAnswer: Answer;
  removeAnswer: Answer;
  likeAnswerEdition: AnswerEdition;
  moveAnswerPosition?: Maybe<Scalars["Int"]>;
  addQuestions?: Maybe<Scalars["Boolean"]>;
  questionNotApply: Question;
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
};

export type MutationEditCommentArgs = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  commentId: Scalars["ID"];
  commentValue: Scalars["String"];
};

export type MutationRemoveCommentArgs = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  commentId: Scalars["ID"];
};

export type MutationEditAnswerArgs = {
  answerId: Scalars["ID"];
  answerValue: Scalars["String"];
};

export type MutationAddAnswerArgs = {
  questionId: Scalars["ID"];
  answerValue: Scalars["String"];
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

export type NewComment = Notification & {
  id: Scalars["ID"];
  type: NotificationType;
  performerId: Scalars["ID"];
  performerAvatarSrc: Scalars["String"];
  text: Scalars["String"];
  seen: Scalars["Boolean"];
  createdOn: Scalars["DateTime"];
  questionId: Scalars["ID"];
  commentId: Scalars["ID"];
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

export type NewLikeNews = NewsBase & {
  type: NewsType;
  performer: User;
  answerOwner: User;
  question: Question;
  createdOn: Scalars["DateTime"];
};

export type News = AnswerNews | CommentNews | NewFollowerNews | NewLikeNews;

export type NewsBase = {
  type: NewsType;
  performer: User;
  createdOn: Scalars["DateTime"];
};

export enum NewsType {
  NewAnswer = "NEW_ANSWER",
  NewAnswerEdition = "NEW_ANSWER_EDITION",
  NewComment = "NEW_COMMENT",
  NewLike = "NEW_LIKE",
  NewFollower = "NEW_FOLLOWER"
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
  NewFollower = "NEW_FOLLOWER",
  NewComment = "NEW_COMMENT"
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
  questions?: Maybe<QuestionConnection>;
  answeredQuestion: Question;
  users?: Maybe<Array<User>>;
  user?: Maybe<User>;
  followers?: Maybe<Array<User>>;
  following?: Maybe<Array<User>>;
};

export type QueryQuestionsArgs = {
  answered: Scalars["Boolean"];
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

export type Question = Node & {
  id: Scalars["ID"];
  tags?: Maybe<Array<Scalars["String"]>>;
  value: Scalars["String"];
  answer?: Maybe<Answer>;
};

export type QuestionConnection = Connection & {
  pageInfo: PageInfo;
  edges?: Maybe<Array<QuestionEdge>>;
  totalCount: Scalars["Int"];
};

export type QuestionEdge = Edge & {
  cursor: Scalars["String"];
  node: Question;
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
};
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

export type AnswerNewsResolvers<
  Context = ApolloContext,
  ParentType = AnswerNews
> = {
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  answerOwner?: Resolver<User, ParentType, Context>;
  question?: Resolver<Question, ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type CommentResolvers<Context = ApolloContext, ParentType = Comment> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  user?: Resolver<User, ParentType, Context>;
  value?: Resolver<Scalars["String"], ParentType, Context>;
};

export type CommentNewsResolvers<
  Context = ApolloContext,
  ParentType = CommentNews
> = {
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  answerOwner?: Resolver<User, ParentType, Context>;
  question?: Resolver<Question, ParentType, Context>;
  commentId?: Resolver<Scalars["ID"], ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type ConnectionResolvers<
  Context = ApolloContext,
  ParentType = Connection
> = {
  __resolveType: TypeResolveFn<"QuestionConnection", ParentType, Context>;
  pageInfo?: Resolver<PageInfo, ParentType, Context>;
  edges?: Resolver<Maybe<Array<Edge>>, ParentType, Context>;
  totalCount?: Resolver<Scalars["Int"], ParentType, Context>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<Scalars["DateTime"], any> {
  name: "DateTime";
}

export type EdgeResolvers<Context = ApolloContext, ParentType = Edge> = {
  __resolveType: TypeResolveFn<"QuestionEdge", ParentType, Context>;
  cursor?: Resolver<Scalars["String"], ParentType, Context>;
  node?: Resolver<Node, ParentType, Context>;
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
  userId?: Resolver<Scalars["ID"], ParentType, Context>;
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
    Question,
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
  questionId?: Resolver<Scalars["ID"], ParentType, Context>;
  commentId?: Resolver<Scalars["ID"], ParentType, Context>;
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

export type NewLikeNewsResolvers<
  Context = ApolloContext,
  ParentType = NewLikeNews
> = {
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  answerOwner?: Resolver<User, ParentType, Context>;
  question?: Resolver<Question, ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type NewsResolvers<Context = ApolloContext, ParentType = News> = {
  __resolveType: TypeResolveFn<
    "AnswerNews" | "CommentNews" | "NewFollowerNews" | "NewLikeNews",
    ParentType,
    Context
  >;
};

export type NewsBaseResolvers<
  Context = ApolloContext,
  ParentType = NewsBase
> = {
  __resolveType: TypeResolveFn<
    "AnswerNews" | "CommentNews" | "NewFollowerNews" | "NewLikeNews",
    ParentType,
    Context
  >;
  type?: Resolver<NewsType, ParentType, Context>;
  performer?: Resolver<User, ParentType, Context>;
  createdOn?: Resolver<Scalars["DateTime"], ParentType, Context>;
};

export type NodeResolvers<Context = ApolloContext, ParentType = Node> = {
  __resolveType: TypeResolveFn<"Question", ParentType, Context>;
  id?: Resolver<Scalars["ID"], ParentType, Context>;
};

export type NotificationResolvers<
  Context = ApolloContext,
  ParentType = Notification
> = {
  __resolveType: TypeResolveFn<
    "NewComment" | "NewFollower",
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
  questions?: Resolver<
    Maybe<QuestionConnection>,
    ParentType,
    Context,
    QueryQuestionsArgs
  >;
  answeredQuestion?: Resolver<
    Question,
    ParentType,
    Context,
    QueryAnsweredQuestionArgs
  >;
  users?: Resolver<Maybe<Array<User>>, ParentType, Context, QueryUsersArgs>;
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

export type QuestionResolvers<
  Context = ApolloContext,
  ParentType = Question
> = {
  id?: Resolver<Scalars["ID"], ParentType, Context>;
  tags?: Resolver<Maybe<Array<Scalars["String"]>>, ParentType, Context>;
  value?: Resolver<Scalars["String"], ParentType, Context>;
  answer?: Resolver<Maybe<Answer>, ParentType, Context>;
};

export type QuestionConnectionResolvers<
  Context = ApolloContext,
  ParentType = QuestionConnection
> = {
  pageInfo?: Resolver<PageInfo, ParentType, Context>;
  edges?: Resolver<Maybe<Array<QuestionEdge>>, ParentType, Context>;
  totalCount?: Resolver<Scalars["Int"], ParentType, Context>;
};

export type QuestionEdgeResolvers<
  Context = ApolloContext,
  ParentType = QuestionEdge
> = {
  cursor?: Resolver<Scalars["String"], ParentType, Context>;
  node?: Resolver<Question, ParentType, Context>;
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
};

export type Resolvers<Context = ApolloContext> = {
  Answer?: AnswerResolvers<Context>;
  AnswerEdition?: AnswerEditionResolvers<Context>;
  AnswerNews?: AnswerNewsResolvers<Context>;
  Comment?: CommentResolvers<Context>;
  CommentNews?: CommentNewsResolvers<Context>;
  Connection?: ConnectionResolvers;
  DateTime?: GraphQLScalarType;
  Edge?: EdgeResolvers;
  Liker?: LikerResolvers<Context>;
  Likes?: LikesResolvers<Context>;
  LoginResult?: LoginResultResolvers<Context>;
  Mutation?: MutationResolvers<Context>;
  NewComment?: NewCommentResolvers<Context>;
  NewFollower?: NewFollowerResolvers<Context>;
  NewFollowerNews?: NewFollowerNewsResolvers<Context>;
  NewLikeNews?: NewLikeNewsResolvers<Context>;
  News?: NewsResolvers;
  NewsBase?: NewsBaseResolvers;
  Node?: NodeResolvers;
  Notification?: NotificationResolvers;
  PageInfo?: PageInfoResolvers<Context>;
  Query?: QueryResolvers<Context>;
  Question?: QuestionResolvers<Context>;
  QuestionConnection?: QuestionConnectionResolvers<Context>;
  QuestionEdge?: QuestionEdgeResolvers<Context>;
  SocialMediaLinks?: SocialMediaLinksResolvers<Context>;
  Subscription?: SubscriptionResolvers<Context>;
  User?: UserResolvers<Context>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<Context = ApolloContext> = Resolvers<Context>;
