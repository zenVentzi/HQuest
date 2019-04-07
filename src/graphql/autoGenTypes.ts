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
export type AnswerNewsFieldsFragment = { __typename?: "AnswerNews" } & {
  performer: { __typename?: "User" } & UserFieldsFragment;
  question: { __typename?: "Question" } & QuestionFieldsFragment;
};

export type CommentNewsFieldsFragment = { __typename?: "CommentNews" } & Pick<
  CommentNews,
  "commentId"
> & {
    performer: { __typename?: "User" } & UserFieldsFragment;
    answerOwner: { __typename?: "User" } & UserFieldsFragment;
    question: { __typename?: "Question" } & QuestionFieldsFragment;
  };

export type NewLikeNewsFieldsFragment = { __typename?: "NewLikeNews" } & {
  performer: { __typename?: "User" } & UserFieldsFragment;
  answerOwner: { __typename?: "User" } & UserFieldsFragment;
  question: { __typename?: "Question" } & QuestionFieldsFragment;
};

export type NewFollowerNewsFieldsFragment = {
  __typename?: "NewFollowerNews";
} & {
  performer: { __typename?: "User" } & UserFieldsFragment;
  followedUser: { __typename?: "User" } & UserFieldsFragment;
};

export type NewsfeedQueryVariables = {};

export type NewsfeedQuery = { __typename?: "Query" } & {
  newsfeed: Maybe<
    Array<
      Pick<NewsBase, "type" | "createdOn"> &
        (
          | ({ __typename?: "AnswerNews" } & AnswerNewsFieldsFragment)
          | ({ __typename?: "CommentNews" } & CommentNewsFieldsFragment)
          | ({ __typename?: "NewLikeNews" } & NewLikeNewsFieldsFragment)
          | ({
              __typename?: "NewFollowerNews";
            } & NewFollowerNewsFieldsFragment))
    >
  >;
};

export type NotificationsQueryVariables = {};

export type NotificationsQuery = { __typename?: "Query" } & {
  notifications: Maybe<Array<NotificationFieldsFragment>>;
};

export type AnsweredQuestionQueryVariables = {
  userId: Scalars["ID"];
  questionId: Scalars["ID"];
};

export type AnsweredQuestionQuery = { __typename?: "Query" } & {
  answeredQuestion: { __typename?: "Question" } & {
    answer: Maybe<{ __typename?: "Answer" } & AnswerFieldsFragment>;
  } & QuestionFieldsFragment;
};

export type QuestionsQueryVariables = {
  answered: Scalars["Boolean"];
  userId: Scalars["ID"];
  tags?: Maybe<Array<Scalars["String"]>>;
  first: Scalars["Int"];
  after?: Maybe<Scalars["String"]>;
};

export type QuestionsQuery = { __typename?: "Query" } & {
  questions: Maybe<
    { __typename?: "QuestionConnection" } & QuestionConnectionFieldsFragment
  >;
};

export type QuestionsTagsQueryVariables = {};

export type QuestionsTagsQuery = { __typename?: "Query" } & Pick<
  Query,
  "questionsTags"
>;

export type UserQueryVariables = {
  id: Scalars["ID"];
};

export type UserQuery = { __typename?: "Query" } & {
  user: Maybe<{ __typename?: "User" } & UserFieldsFragment>;
};

export type UsersQueryVariables = {
  match?: Maybe<Scalars["String"]>;
};

export type UsersQuery = { __typename?: "Query" } & {
  users: Maybe<Array<{ __typename?: "User" } & UserFieldsFragment>>;
};

export type FollowersQueryVariables = {
  userId: Scalars["ID"];
};

export type FollowersQuery = { __typename?: "Query" } & {
  followers: Maybe<Array<{ __typename?: "User" } & UserFieldsFragment>>;
};

export type FollowingQueryVariables = {
  userId: Scalars["ID"];
};

export type FollowingQuery = { __typename?: "Query" } & {
  following: Maybe<Array<{ __typename?: "User" } & UserFieldsFragment>>;
};

export type NotifsMarkSeenMutationVariables = {};

export type NotifsMarkSeenMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "notifsMarkSeen"
>;

export type CommentAnswerEditionMutationVariables = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  comment: Scalars["String"];
  mentionedUsers?: Maybe<Array<Scalars["ID"]>>;
};

export type CommentAnswerEditionMutation = { __typename?: "Mutation" } & {
  commentAnswerEdition: { __typename?: "Comment" } & CommentFieldsFragment;
};

export type EditCommentMutationVariables = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  commentId: Scalars["ID"];
  commentValue: Scalars["String"];
  mentionedUsers?: Maybe<Array<Scalars["ID"]>>;
};

export type EditCommentMutation = { __typename?: "Mutation" } & {
  editComment: { __typename?: "Comment" } & CommentFieldsFragment;
};

export type RemoveCommentMutationVariables = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  commentId: Scalars["ID"];
};

export type RemoveCommentMutation = { __typename?: "Mutation" } & {
  removeComment: { __typename?: "Comment" } & CommentFieldsFragment;
};

export type MoveAnswerPositionMutationVariables = {
  position: Scalars["Int"];
  answerId: Scalars["ID"];
};

export type MoveAnswerPositionMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "moveAnswerPosition"
>;

export type AddAnswerMutationVariables = {
  questionId: Scalars["ID"];
  answerValue: Scalars["String"];
};

export type AddAnswerMutation = { __typename?: "Mutation" } & {
  addAnswer: { __typename?: "Answer" } & AnswerFieldsFragment;
};

export type EditAnswerMutationVariables = {
  answerId: Scalars["ID"];
  answerValue: Scalars["String"];
};

export type EditAnswerMutation = { __typename?: "Mutation" } & {
  editAnswer: { __typename?: "Answer" } & AnswerFieldsFragment;
};

export type RemoveAnswerMutationVariables = {
  answerId: Scalars["ID"];
};

export type RemoveAnswerMutation = { __typename?: "Mutation" } & {
  removeAnswer: { __typename?: "Answer" } & AnswerFieldsFragment;
};

export type LikeAnswerEditionMutationVariables = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  userLikes: Scalars["Int"];
};

export type LikeAnswerEditionMutation = { __typename?: "Mutation" } & {
  likeAnswerEdition: { __typename?: "AnswerEdition" } & EditionFieldsFragment;
};

export type AddQuestionsMutationVariables = {
  questions?: Maybe<Array<InputQuestion>>;
};

export type AddQuestionsMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "addQuestions"
>;

export type QuestionNotApplyMutationVariables = {
  questionId: Scalars["ID"];
};

export type QuestionNotApplyMutation = { __typename?: "Mutation" } & {
  questionNotApply: { __typename?: "Question" } & QuestionFieldsFragment;
};

export type LoginMutationVariables = {
  email: Scalars["String"];
  name: Scalars["String"];
};

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "LoginResult" } & Pick<
    LoginResult,
    "authToken" | "userId"
  >;
};

export type EditUserMutationVariables = {
  input?: Maybe<EditUserInput>;
};

export type EditUserMutation = { __typename?: "Mutation" } & {
  editUser: { __typename?: "User" } & Pick<User, "id">;
};

export type FollowMutationVariables = {
  userId: Scalars["ID"];
  follow: Scalars["Boolean"];
};

export type FollowMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "follow"
>;

export type UploadAvatarMutationVariables = {
  base64Img: Scalars["String"];
};

export type UploadAvatarMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "uploadAvatar"
>;

export type NewNotificationSubscriptionVariables = {
  userId: Scalars["ID"];
};

export type NewNotificationSubscription = { __typename?: "Subscription" } & {
  newNotification: NotificationFieldsFragment;
};

export type UserFieldsFragment = { __typename?: "User" } & Pick<
  User,
  "id" | "fullName" | "avatarSrc" | "intro" | "me" | "followers" | "following"
> & {
    socialMediaLinks: Maybe<
      { __typename?: "SocialMediaLinks" } & Pick<
        SocialMediaLinks,
        "facebookLink" | "twitterLink" | "instagramLink" | "linkedInLink"
      >
    >;
  };

export type CommentFieldsFragment = { __typename?: "Comment" } & Pick<
  Comment,
  "id" | "value"
> & { user: { __typename?: "User" } & UserFieldsFragment };

export type LikerFieldsFragment = { __typename?: "Liker" } & Pick<
  Liker,
  "numOfLikes"
> & { user: { __typename?: "User" } & UserFieldsFragment };

export type LikesFieldsFragment = { __typename?: "Likes" } & Pick<
  Likes,
  "total"
> & { likers: Array<{ __typename?: "Liker" } & LikerFieldsFragment> };

export type EditionFieldsFragment = { __typename?: "AnswerEdition" } & Pick<
  AnswerEdition,
  "id" | "date" | "value"
> & {
    comments: Maybe<Array<{ __typename?: "Comment" } & CommentFieldsFragment>>;
    likes: Maybe<{ __typename?: "Likes" } & LikesFieldsFragment>;
  };

export type AnswerFieldsFragment = { __typename?: "Answer" } & Pick<
  Answer,
  "id" | "position" | "userId" | "questionId"
> & {
    editions: Array<{ __typename?: "AnswerEdition" } & EditionFieldsFragment>;
  };

export type QuestionFieldsFragment = { __typename?: "Question" } & Pick<
  Question,
  "id" | "value" | "tags"
> & { answer: Maybe<{ __typename?: "Answer" } & AnswerFieldsFragment> };

export type PageInfoFieldsFragment = { __typename?: "PageInfo" } & Pick<
  PageInfo,
  "startCursor" | "endCursor" | "hasNextPage" | "hasPreviousPage"
>;

export type QuestionEdgeFieldsFragment = Pick<Edge, "cursor"> & {
  node: QuestionFieldsFragment;
};

export type QuestionConnectionFieldsFragment = {
  __typename?: "QuestionConnection";
} & Pick<QuestionConnection, "totalCount"> & {
    pageInfo: { __typename?: "PageInfo" } & PageInfoFieldsFragment;
    edges: Maybe<
      Array<{ __typename?: "QuestionEdge" } & QuestionEdgeFieldsFragment>
    >;
  };

export type NotificationFieldsFragment = Pick<
  Notification,
  | "id"
  | "type"
  | "performerId"
  | "performerAvatarSrc"
  | "text"
  | "seen"
  | "createdOn"
> &
  ({ __typename?: "NewComment" } & Pick<
    NewComment,
    "commentId" | "questionId"
  >);
