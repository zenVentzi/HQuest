export type Maybe<T> = T | null;

export interface InputQuestion {
  value: string;

  tags: string[];
}

export interface EditUserInput {
  fullName: string;

  intro: string;

  socialMediaLinks: SocialMediaLinksInput;
}

export interface SocialMediaLinksInput {
  facebookLink?: Maybe<string>;

  twitterLink?: Maybe<string>;

  instagramLink?: Maybe<string>;

  linkedInLink?: Maybe<string>;
}

export enum NewsType {
  NewAnswer = "NEW_ANSWER",
  NewAnswerEdition = "NEW_ANSWER_EDITION",
  NewComment = "NEW_COMMENT",
  NewLike = "NEW_LIKE",
  NewFollower = "NEW_FOLLOWER"
}

export enum NotificationType {
  NewFollower = "NEW_FOLLOWER",
  NewComment = "NEW_COMMENT"
}

export type DateTime = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Interfaces
// ====================================================

export interface NewsBase {
  type: NewsType;

  performer: User;

  createdOn: DateTime;
}

export interface Notification {
  id: string;

  type: NotificationType;

  performerId: string;

  performerAvatarSrc: string;

  text: string;

  seen: boolean;

  createdOn: DateTime;
}

export interface Connection {
  pageInfo: PageInfo;

  edges?: Maybe<Edge[]>;

  totalCount: number;
}

export interface Edge {
  cursor: string;

  node: Node;
}

export interface Node {
  id: string;
}

// ====================================================
// Types
// ====================================================

export interface Query {
  newsfeed?: Maybe<NewsBase[]>;

  notifications?: Maybe<Notification[]>;

  questionsTags: string[];

  questions?: Maybe<QuestionConnection>;

  answeredQuestion: Question;

  users?: Maybe<User[]>;

  user?: Maybe<User>;

  followers?: Maybe<User[]>;

  following?: Maybe<User[]>;
}

export interface User {
  id: string;

  me?: Maybe<boolean>;

  email?: Maybe<string>;

  fullName?: Maybe<string>;

  intro?: Maybe<string>;

  socialMediaLinks?: Maybe<SocialMediaLinks>;

  avatarSrc?: Maybe<string>;

  following?: Maybe<string[]>;

  followers?: Maybe<string[]>;
}

export interface SocialMediaLinks {
  facebookLink?: Maybe<string>;

  twitterLink?: Maybe<string>;

  instagramLink?: Maybe<string>;

  linkedInLink?: Maybe<string>;
}

export interface QuestionConnection extends Connection {
  pageInfo: PageInfo;

  edges?: Maybe<QuestionEdge[]>;

  totalCount: number;
}

export interface PageInfo {
  startCursor?: Maybe<string>;

  endCursor?: Maybe<string>;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

export interface QuestionEdge extends Edge {
  cursor: string;

  node: Question;
}

/** question should be made an interface */
export interface Question extends Node {
  id: string;

  tags?: Maybe<string[]>;

  value: string;

  answer?: Maybe<Answer>;
}

export interface Answer {
  id: string;

  userId: string;

  questionId: string;

  value: string;

  comments?: Maybe<Comment[]>;

  likes?: Maybe<Likes>;

  editions?: Maybe<AnswerEdition[]>;

  position: number;
}

export interface Comment {
  id: string;

  user: User;

  value: string;
}

export interface Likes {
  total: number;

  likers: Liker[];
}

export interface Liker {
  user: User;

  numOfLikes: number;
}

export interface AnswerEdition {
  id: string;

  date: DateTime;

  before: string;

  after: string;
}

export interface Mutation {
  notifsMarkSeen?: Maybe<boolean>;

  commentAnswer: Comment;

  editComment: Comment;

  removeComment: Comment;

  editAnswer: Answer;

  addAnswer: Answer;

  removeAnswer: Answer;

  likeAnswer: Answer;

  moveAnswerPosition?: Maybe<number>;

  addQuestions?: Maybe<boolean>;
  /** removeQuestion(questionId: ID!): Question! */
  questionNotApply: Question;

  signUp?: Maybe<string>;

  login: LoginResult;

  editUser: User;

  uploadAvatar: string;

  follow?: Maybe<boolean>;
}

export interface LoginResult {
  authToken: string;

  userId: string;
}

export interface Subscription {
  newNotification: Notification;
}

export interface AnswerNews extends NewsBase {
  type: NewsType;

  performer: User;

  answerOwner: User;

  question: Question;

  createdOn: DateTime;
}

export interface CommentNews extends NewsBase {
  type: NewsType;

  performer: User;

  answerOwner: User;

  question: Question;

  commentId: string;

  createdOn: DateTime;
}

export interface NewFollowerNews extends NewsBase {
  type: NewsType;

  performer: User;

  followedUser: User;

  createdOn: DateTime;
}

export interface NewLikeNews extends NewsBase {
  type: NewsType;

  performer: User;

  answerOwner: User;

  question: Question;

  createdOn: DateTime;
}

export interface NewComment extends Notification {
  id: string;

  type: NotificationType;

  performerId: string;

  performerAvatarSrc: string;

  text: string;

  seen: boolean;

  createdOn: DateTime;

  questionId: string;

  commentId: string;
}

export interface NewFollower extends Notification {
  id: string;

  type: NotificationType;

  performerId: string;

  performerAvatarSrc: string;

  text: string;

  seen: boolean;

  createdOn: DateTime;
}

// ====================================================
// Arguments
// ====================================================

export interface QuestionsQueryArgs {
  answered: boolean;

  userId: string;

  tags?: Maybe<string[]>;

  first: number;

  after?: Maybe<string>;
}
export interface AnsweredQuestionQueryArgs {
  userId: string;

  questionId: string;
}
export interface UsersQueryArgs {
  match?: Maybe<string>;
}
export interface UserQueryArgs {
  id: string;
}
export interface FollowersQueryArgs {
  userId: string;
}
export interface FollowingQueryArgs {
  userId: string;
}
export interface CommentAnswerMutationArgs {
  answerId: string;

  comment: string;
}
export interface EditCommentMutationArgs {
  answerId: string;

  commentId: string;

  commentValue: string;
}
export interface RemoveCommentMutationArgs {
  answerId: string;

  commentId: string;
}
export interface EditAnswerMutationArgs {
  answerId: string;

  answerValue: string;
}
export interface AddAnswerMutationArgs {
  questionId: string;

  answerValue: string;
}
export interface RemoveAnswerMutationArgs {
  answerId: string;
}
export interface LikeAnswerMutationArgs {
  answerId: string;

  userLikes: number;
}
export interface MoveAnswerPositionMutationArgs {
  answerId: string;

  position: number;
}
export interface AddQuestionsMutationArgs {
  questions?: Maybe<InputQuestion[]>;
}
export interface QuestionNotApplyMutationArgs {
  questionId: string;
}
export interface SignUpMutationArgs {
  firstName: string;

  surName: string;

  email: string;

  password: string;
}
export interface LoginMutationArgs {
  email: string;

  name: string;
}
export interface EditUserMutationArgs {
  input?: Maybe<EditUserInput>;
}
export interface UploadAvatarMutationArgs {
  base64Img: string;
}
export interface FollowMutationArgs {
  userId: string;

  follow: boolean;
}
export interface NewNotificationSubscriptionArgs {
  userId: string;
}

// ====================================================
// Unions
// ====================================================

export type News = AnswerNews | CommentNews | NewFollowerNews | NewLikeNews;

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

import { ApolloContext } from "../types/gqlContext";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = {}> {
    newsfeed?: NewsfeedResolver<Maybe<NewsBase[]>, TypeParent, Context>;

    notifications?: NotificationsResolver<
      Maybe<Notification[]>,
      TypeParent,
      Context
    >;

    questionsTags?: QuestionsTagsResolver<string[], TypeParent, Context>;

    questions?: QuestionsResolver<
      Maybe<QuestionConnection>,
      TypeParent,
      Context
    >;

    answeredQuestion?: AnsweredQuestionResolver<Question, TypeParent, Context>;

    users?: UsersResolver<Maybe<User[]>, TypeParent, Context>;

    user?: UserResolver<Maybe<User>, TypeParent, Context>;

    followers?: FollowersResolver<Maybe<User[]>, TypeParent, Context>;

    following?: FollowingResolver<Maybe<User[]>, TypeParent, Context>;
  }

  export type NewsfeedResolver<
    R = Maybe<NewsBase[]>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type NotificationsResolver<
    R = Maybe<Notification[]>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type QuestionsTagsResolver<
    R = string[],
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type QuestionsResolver<
    R = Maybe<QuestionConnection>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, QuestionsArgs>;
  export interface QuestionsArgs {
    answered: boolean;

    userId: string;

    tags?: Maybe<string[]>;

    first: number;

    after?: Maybe<string>;
  }

  export type AnsweredQuestionResolver<
    R = Question,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, AnsweredQuestionArgs>;
  export interface AnsweredQuestionArgs {
    userId: string;

    questionId: string;
  }

  export type UsersResolver<
    R = Maybe<User[]>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, UsersArgs>;
  export interface UsersArgs {
    match?: Maybe<string>;
  }

  export type UserResolver<
    R = Maybe<User>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, UserArgs>;
  export interface UserArgs {
    id: string;
  }

  export type FollowersResolver<
    R = Maybe<User[]>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, FollowersArgs>;
  export interface FollowersArgs {
    userId: string;
  }

  export type FollowingResolver<
    R = Maybe<User[]>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, FollowingArgs>;
  export interface FollowingArgs {
    userId: string;
  }
}

export namespace UserResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = User> {
    id?: IdResolver<string, TypeParent, Context>;

    me?: MeResolver<Maybe<boolean>, TypeParent, Context>;

    email?: EmailResolver<Maybe<string>, TypeParent, Context>;

    fullName?: FullNameResolver<Maybe<string>, TypeParent, Context>;

    intro?: IntroResolver<Maybe<string>, TypeParent, Context>;

    socialMediaLinks?: SocialMediaLinksResolver<
      Maybe<SocialMediaLinks>,
      TypeParent,
      Context
    >;

    avatarSrc?: AvatarSrcResolver<Maybe<string>, TypeParent, Context>;

    following?: FollowingResolver<Maybe<string[]>, TypeParent, Context>;

    followers?: FollowersResolver<Maybe<string[]>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type MeResolver<
    R = Maybe<boolean>,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type EmailResolver<
    R = Maybe<string>,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type FullNameResolver<
    R = Maybe<string>,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type IntroResolver<
    R = Maybe<string>,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type SocialMediaLinksResolver<
    R = Maybe<SocialMediaLinks>,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type AvatarSrcResolver<
    R = Maybe<string>,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type FollowingResolver<
    R = Maybe<string[]>,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type FollowersResolver<
    R = Maybe<string[]>,
    Parent = User,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace SocialMediaLinksResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = SocialMediaLinks
  > {
    facebookLink?: FacebookLinkResolver<Maybe<string>, TypeParent, Context>;

    twitterLink?: TwitterLinkResolver<Maybe<string>, TypeParent, Context>;

    instagramLink?: InstagramLinkResolver<Maybe<string>, TypeParent, Context>;

    linkedInLink?: LinkedInLinkResolver<Maybe<string>, TypeParent, Context>;
  }

  export type FacebookLinkResolver<
    R = Maybe<string>,
    Parent = SocialMediaLinks,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type TwitterLinkResolver<
    R = Maybe<string>,
    Parent = SocialMediaLinks,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type InstagramLinkResolver<
    R = Maybe<string>,
    Parent = SocialMediaLinks,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type LinkedInLinkResolver<
    R = Maybe<string>,
    Parent = SocialMediaLinks,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace QuestionConnectionResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = QuestionConnection
  > {
    pageInfo?: PageInfoResolver<PageInfo, TypeParent, Context>;

    edges?: EdgesResolver<Maybe<QuestionEdge[]>, TypeParent, Context>;

    totalCount?: TotalCountResolver<number, TypeParent, Context>;
  }

  export type PageInfoResolver<
    R = PageInfo,
    Parent = QuestionConnection,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type EdgesResolver<
    R = Maybe<QuestionEdge[]>,
    Parent = QuestionConnection,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type TotalCountResolver<
    R = number,
    Parent = QuestionConnection,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace PageInfoResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = PageInfo> {
    startCursor?: StartCursorResolver<Maybe<string>, TypeParent, Context>;

    endCursor?: EndCursorResolver<Maybe<string>, TypeParent, Context>;

    hasNextPage?: HasNextPageResolver<boolean, TypeParent, Context>;

    hasPreviousPage?: HasPreviousPageResolver<boolean, TypeParent, Context>;
  }

  export type StartCursorResolver<
    R = Maybe<string>,
    Parent = PageInfo,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type EndCursorResolver<
    R = Maybe<string>,
    Parent = PageInfo,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type HasNextPageResolver<
    R = boolean,
    Parent = PageInfo,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type HasPreviousPageResolver<
    R = boolean,
    Parent = PageInfo,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace QuestionEdgeResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = QuestionEdge
  > {
    cursor?: CursorResolver<string, TypeParent, Context>;

    node?: NodeResolver<Question, TypeParent, Context>;
  }

  export type CursorResolver<
    R = string,
    Parent = QuestionEdge,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type NodeResolver<
    R = Question,
    Parent = QuestionEdge,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}
/** question should be made an interface */
export namespace QuestionResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = Question> {
    id?: IdResolver<string, TypeParent, Context>;

    tags?: TagsResolver<Maybe<string[]>, TypeParent, Context>;

    value?: ValueResolver<string, TypeParent, Context>;

    answer?: AnswerResolver<Maybe<Answer>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Question,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type TagsResolver<
    R = Maybe<string[]>,
    Parent = Question,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = string,
    Parent = Question,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type AnswerResolver<
    R = Maybe<Answer>,
    Parent = Question,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace AnswerResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = Answer> {
    id?: IdResolver<string, TypeParent, Context>;

    userId?: UserIdResolver<string, TypeParent, Context>;

    questionId?: QuestionIdResolver<string, TypeParent, Context>;

    value?: ValueResolver<string, TypeParent, Context>;

    comments?: CommentsResolver<Maybe<Comment[]>, TypeParent, Context>;

    likes?: LikesResolver<Maybe<Likes>, TypeParent, Context>;

    editions?: EditionsResolver<Maybe<AnswerEdition[]>, TypeParent, Context>;

    position?: PositionResolver<number, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Answer,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type UserIdResolver<
    R = string,
    Parent = Answer,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type QuestionIdResolver<
    R = string,
    Parent = Answer,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = string,
    Parent = Answer,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CommentsResolver<
    R = Maybe<Comment[]>,
    Parent = Answer,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type LikesResolver<
    R = Maybe<Likes>,
    Parent = Answer,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type EditionsResolver<
    R = Maybe<AnswerEdition[]>,
    Parent = Answer,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PositionResolver<
    R = number,
    Parent = Answer,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace CommentResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = Comment> {
    id?: IdResolver<string, TypeParent, Context>;

    user?: UserResolver<User, TypeParent, Context>;

    value?: ValueResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Comment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type UserResolver<
    R = User,
    Parent = Comment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type ValueResolver<
    R = string,
    Parent = Comment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace LikesResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = Likes> {
    total?: TotalResolver<number, TypeParent, Context>;

    likers?: LikersResolver<Liker[], TypeParent, Context>;
  }

  export type TotalResolver<
    R = number,
    Parent = Likes,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type LikersResolver<
    R = Liker[],
    Parent = Likes,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace LikerResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = Liker> {
    user?: UserResolver<User, TypeParent, Context>;

    numOfLikes?: NumOfLikesResolver<number, TypeParent, Context>;
  }

  export type UserResolver<
    R = User,
    Parent = Liker,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type NumOfLikesResolver<
    R = number,
    Parent = Liker,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace AnswerEditionResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = AnswerEdition
  > {
    id?: IdResolver<string, TypeParent, Context>;

    date?: DateResolver<DateTime, TypeParent, Context>;

    before?: BeforeResolver<string, TypeParent, Context>;

    after?: AfterResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = AnswerEdition,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type DateResolver<
    R = DateTime,
    Parent = AnswerEdition,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type BeforeResolver<
    R = string,
    Parent = AnswerEdition,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type AfterResolver<
    R = string,
    Parent = AnswerEdition,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = {}> {
    notifsMarkSeen?: NotifsMarkSeenResolver<
      Maybe<boolean>,
      TypeParent,
      Context
    >;

    commentAnswer?: CommentAnswerResolver<Comment, TypeParent, Context>;

    editComment?: EditCommentResolver<Comment, TypeParent, Context>;

    removeComment?: RemoveCommentResolver<Comment, TypeParent, Context>;

    editAnswer?: EditAnswerResolver<Answer, TypeParent, Context>;

    addAnswer?: AddAnswerResolver<Answer, TypeParent, Context>;

    removeAnswer?: RemoveAnswerResolver<Answer, TypeParent, Context>;

    likeAnswer?: LikeAnswerResolver<Answer, TypeParent, Context>;

    moveAnswerPosition?: MoveAnswerPositionResolver<
      Maybe<number>,
      TypeParent,
      Context
    >;

    addQuestions?: AddQuestionsResolver<Maybe<boolean>, TypeParent, Context>;
    /** removeQuestion(questionId: ID!): Question! */
    questionNotApply?: QuestionNotApplyResolver<Question, TypeParent, Context>;

    signUp?: SignUpResolver<Maybe<string>, TypeParent, Context>;

    login?: LoginResolver<LoginResult, TypeParent, Context>;

    editUser?: EditUserResolver<User, TypeParent, Context>;

    uploadAvatar?: UploadAvatarResolver<string, TypeParent, Context>;

    follow?: FollowResolver<Maybe<boolean>, TypeParent, Context>;
  }

  export type NotifsMarkSeenResolver<
    R = Maybe<boolean>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CommentAnswerResolver<
    R = Comment,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, CommentAnswerArgs>;
  export interface CommentAnswerArgs {
    answerId: string;

    comment: string;
  }

  export type EditCommentResolver<
    R = Comment,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, EditCommentArgs>;
  export interface EditCommentArgs {
    answerId: string;

    commentId: string;

    commentValue: string;
  }

  export type RemoveCommentResolver<
    R = Comment,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, RemoveCommentArgs>;
  export interface RemoveCommentArgs {
    answerId: string;

    commentId: string;
  }

  export type EditAnswerResolver<
    R = Answer,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, EditAnswerArgs>;
  export interface EditAnswerArgs {
    answerId: string;

    answerValue: string;
  }

  export type AddAnswerResolver<
    R = Answer,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, AddAnswerArgs>;
  export interface AddAnswerArgs {
    questionId: string;

    answerValue: string;
  }

  export type RemoveAnswerResolver<
    R = Answer,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, RemoveAnswerArgs>;
  export interface RemoveAnswerArgs {
    answerId: string;
  }

  export type LikeAnswerResolver<
    R = Answer,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, LikeAnswerArgs>;
  export interface LikeAnswerArgs {
    answerId: string;

    userLikes: number;
  }

  export type MoveAnswerPositionResolver<
    R = Maybe<number>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, MoveAnswerPositionArgs>;
  export interface MoveAnswerPositionArgs {
    answerId: string;

    position: number;
  }

  export type AddQuestionsResolver<
    R = Maybe<boolean>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, AddQuestionsArgs>;
  export interface AddQuestionsArgs {
    questions?: Maybe<InputQuestion[]>;
  }

  export type QuestionNotApplyResolver<
    R = Question,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, QuestionNotApplyArgs>;
  export interface QuestionNotApplyArgs {
    questionId: string;
  }

  export type SignUpResolver<
    R = Maybe<string>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, SignUpArgs>;
  export interface SignUpArgs {
    firstName: string;

    surName: string;

    email: string;

    password: string;
  }

  export type LoginResolver<
    R = LoginResult,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, LoginArgs>;
  export interface LoginArgs {
    email: string;

    name: string;
  }

  export type EditUserResolver<
    R = User,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, EditUserArgs>;
  export interface EditUserArgs {
    input?: Maybe<EditUserInput>;
  }

  export type UploadAvatarResolver<
    R = string,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, UploadAvatarArgs>;
  export interface UploadAvatarArgs {
    base64Img: string;
  }

  export type FollowResolver<
    R = Maybe<boolean>,
    Parent = {},
    Context = ApolloContext
  > = Resolver<R, Parent, Context, FollowArgs>;
  export interface FollowArgs {
    userId: string;

    follow: boolean;
  }
}

export namespace LoginResultResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = LoginResult
  > {
    authToken?: AuthTokenResolver<string, TypeParent, Context>;

    userId?: UserIdResolver<string, TypeParent, Context>;
  }

  export type AuthTokenResolver<
    R = string,
    Parent = LoginResult,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type UserIdResolver<
    R = string,
    Parent = LoginResult,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace SubscriptionResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = {}> {
    newNotification?: NewNotificationResolver<
      Notification,
      TypeParent,
      Context
    >;
  }

  export type NewNotificationResolver<
    R = Notification,
    Parent = {},
    Context = ApolloContext
  > = SubscriptionResolver<R, Parent, Context, NewNotificationArgs>;
  export interface NewNotificationArgs {
    userId: string;
  }
}

export namespace AnswerNewsResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = AnswerNews> {
    type?: TypeResolver<NewsType, TypeParent, Context>;

    performer?: PerformerResolver<User, TypeParent, Context>;

    answerOwner?: AnswerOwnerResolver<User, TypeParent, Context>;

    question?: QuestionResolver<Question, TypeParent, Context>;

    createdOn?: CreatedOnResolver<DateTime, TypeParent, Context>;
  }

  export type TypeResolver<
    R = NewsType,
    Parent = AnswerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PerformerResolver<
    R = User,
    Parent = AnswerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type AnswerOwnerResolver<
    R = User,
    Parent = AnswerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type QuestionResolver<
    R = Question,
    Parent = AnswerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CreatedOnResolver<
    R = DateTime,
    Parent = AnswerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace CommentNewsResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = CommentNews
  > {
    type?: TypeResolver<NewsType, TypeParent, Context>;

    performer?: PerformerResolver<User, TypeParent, Context>;

    answerOwner?: AnswerOwnerResolver<User, TypeParent, Context>;

    question?: QuestionResolver<Question, TypeParent, Context>;

    commentId?: CommentIdResolver<string, TypeParent, Context>;

    createdOn?: CreatedOnResolver<DateTime, TypeParent, Context>;
  }

  export type TypeResolver<
    R = NewsType,
    Parent = CommentNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PerformerResolver<
    R = User,
    Parent = CommentNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type AnswerOwnerResolver<
    R = User,
    Parent = CommentNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type QuestionResolver<
    R = Question,
    Parent = CommentNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CommentIdResolver<
    R = string,
    Parent = CommentNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CreatedOnResolver<
    R = DateTime,
    Parent = CommentNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace NewFollowerNewsResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = NewFollowerNews
  > {
    type?: TypeResolver<NewsType, TypeParent, Context>;

    performer?: PerformerResolver<User, TypeParent, Context>;

    followedUser?: FollowedUserResolver<User, TypeParent, Context>;

    createdOn?: CreatedOnResolver<DateTime, TypeParent, Context>;
  }

  export type TypeResolver<
    R = NewsType,
    Parent = NewFollowerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PerformerResolver<
    R = User,
    Parent = NewFollowerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type FollowedUserResolver<
    R = User,
    Parent = NewFollowerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CreatedOnResolver<
    R = DateTime,
    Parent = NewFollowerNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace NewLikeNewsResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = NewLikeNews
  > {
    type?: TypeResolver<NewsType, TypeParent, Context>;

    performer?: PerformerResolver<User, TypeParent, Context>;

    answerOwner?: AnswerOwnerResolver<User, TypeParent, Context>;

    question?: QuestionResolver<Question, TypeParent, Context>;

    createdOn?: CreatedOnResolver<DateTime, TypeParent, Context>;
  }

  export type TypeResolver<
    R = NewsType,
    Parent = NewLikeNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PerformerResolver<
    R = User,
    Parent = NewLikeNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type AnswerOwnerResolver<
    R = User,
    Parent = NewLikeNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type QuestionResolver<
    R = Question,
    Parent = NewLikeNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CreatedOnResolver<
    R = DateTime,
    Parent = NewLikeNews,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace NewCommentResolvers {
  export interface Resolvers<Context = ApolloContext, TypeParent = NewComment> {
    id?: IdResolver<string, TypeParent, Context>;

    type?: TypeResolver<NotificationType, TypeParent, Context>;

    performerId?: PerformerIdResolver<string, TypeParent, Context>;

    performerAvatarSrc?: PerformerAvatarSrcResolver<
      string,
      TypeParent,
      Context
    >;

    text?: TextResolver<string, TypeParent, Context>;

    seen?: SeenResolver<boolean, TypeParent, Context>;

    createdOn?: CreatedOnResolver<DateTime, TypeParent, Context>;

    questionId?: QuestionIdResolver<string, TypeParent, Context>;

    commentId?: CommentIdResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = NotificationType,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PerformerIdResolver<
    R = string,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PerformerAvatarSrcResolver<
    R = string,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type TextResolver<
    R = string,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type SeenResolver<
    R = boolean,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CreatedOnResolver<
    R = DateTime,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type QuestionIdResolver<
    R = string,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CommentIdResolver<
    R = string,
    Parent = NewComment,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace NewFollowerResolvers {
  export interface Resolvers<
    Context = ApolloContext,
    TypeParent = NewFollower
  > {
    id?: IdResolver<string, TypeParent, Context>;

    type?: TypeResolver<NotificationType, TypeParent, Context>;

    performerId?: PerformerIdResolver<string, TypeParent, Context>;

    performerAvatarSrc?: PerformerAvatarSrcResolver<
      string,
      TypeParent,
      Context
    >;

    text?: TextResolver<string, TypeParent, Context>;

    seen?: SeenResolver<boolean, TypeParent, Context>;

    createdOn?: CreatedOnResolver<DateTime, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = NewFollower,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type TypeResolver<
    R = NotificationType,
    Parent = NewFollower,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PerformerIdResolver<
    R = string,
    Parent = NewFollower,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type PerformerAvatarSrcResolver<
    R = string,
    Parent = NewFollower,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type TextResolver<
    R = string,
    Parent = NewFollower,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type SeenResolver<
    R = boolean,
    Parent = NewFollower,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
  export type CreatedOnResolver<
    R = DateTime,
    Parent = NewFollower,
    Context = ApolloContext
  > = Resolver<R, Parent, Context>;
}

export namespace NewsBaseResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "AnswerNews" | "CommentNews" | "NewFollowerNews" | "NewLikeNews",
    Parent = AnswerNews | CommentNews | NewFollowerNews | NewLikeNews,
    Context = ApolloContext
  > = TypeResolveFn<R, Parent, Context>;
}

export namespace NotificationResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "NewComment" | "NewFollower",
    Parent = NewComment | NewFollower,
    Context = ApolloContext
  > = TypeResolveFn<R, Parent, Context>;
}

export namespace ConnectionResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "QuestionConnection",
    Parent = QuestionConnection,
    Context = ApolloContext
  > = TypeResolveFn<R, Parent, Context>;
}

export namespace EdgeResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "QuestionEdge",
    Parent = QuestionEdge,
    Context = ApolloContext
  > = TypeResolveFn<R, Parent, Context>;
}

export namespace NodeResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "Question",
    Parent = Question,
    Context = ApolloContext
  > = TypeResolveFn<R, Parent, Context>;
}

export namespace NewsResolvers {
  export interface Resolvers {
    __resolveType: ResolveType;
  }
  export type ResolveType<
    R = "AnswerNews" | "CommentNews" | "NewFollowerNews" | "NewLikeNews",
    Parent = AnswerNews | CommentNews | NewFollowerNews | NewLikeNews,
    Context = ApolloContext
  > = TypeResolveFn<R, Parent, Context>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  ApolloContext
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  ApolloContext
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  ApolloContext
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted in [Markdown](https://daringfireball.net/projects/markdown/). */
  reason?: string;
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<DateTime, any> {
  name: "DateTime";
}

export interface IResolvers {
  Query?: QueryResolvers.Resolvers;
  User?: UserResolvers.Resolvers;
  SocialMediaLinks?: SocialMediaLinksResolvers.Resolvers;
  QuestionConnection?: QuestionConnectionResolvers.Resolvers;
  PageInfo?: PageInfoResolvers.Resolvers;
  QuestionEdge?: QuestionEdgeResolvers.Resolvers;
  Question?: QuestionResolvers.Resolvers;
  Answer?: AnswerResolvers.Resolvers;
  Comment?: CommentResolvers.Resolvers;
  Likes?: LikesResolvers.Resolvers;
  Liker?: LikerResolvers.Resolvers;
  AnswerEdition?: AnswerEditionResolvers.Resolvers;
  Mutation?: MutationResolvers.Resolvers;
  LoginResult?: LoginResultResolvers.Resolvers;
  Subscription?: SubscriptionResolvers.Resolvers;
  AnswerNews?: AnswerNewsResolvers.Resolvers;
  CommentNews?: CommentNewsResolvers.Resolvers;
  NewFollowerNews?: NewFollowerNewsResolvers.Resolvers;
  NewLikeNews?: NewLikeNewsResolvers.Resolvers;
  NewComment?: NewCommentResolvers.Resolvers;
  NewFollower?: NewFollowerResolvers.Resolvers;
  NewsBase?: NewsBaseResolvers.Resolvers;
  Notification?: NotificationResolvers.Resolvers;
  Connection?: ConnectionResolvers.Resolvers;
  Edge?: EdgeResolvers.Resolvers;
  Node?: NodeResolvers.Resolvers;
  News?: NewsResolvers.Resolvers;
  DateTime?: GraphQLScalarType;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
