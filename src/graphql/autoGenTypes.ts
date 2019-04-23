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
};
export type NewAnswerEditionNewsFieldsFragment = {
  __typename?: "NewAnswerEditionNews";
} & {
  performer: { __typename?: "User" } & UserFieldsFragment;
  question: {
    __typename?: "AnsweredQuestion";
  } & AnsweredQuestionFieldsFragment;
};

export type NewCommentNewsFieldsFragment = {
  __typename?: "NewCommentNews";
} & Pick<NewCommentNews, "editionId" | "commentId"> & {
    performer: { __typename?: "User" } & UserFieldsFragment;
    answerOwner: { __typename?: "User" } & UserFieldsFragment;
    question: {
      __typename?: "AnsweredQuestion";
    } & AnsweredQuestionFieldsFragment;
  };

export type EditionLikeNewsFieldsFragment = {
  __typename?: "EditionLikeNews";
} & Pick<EditionLikeNews, "editionId"> & {
    performer: { __typename?: "User" } & UserFieldsFragment;
    answerOwner: { __typename?: "User" } & UserFieldsFragment;
    question: {
      __typename?: "AnsweredQuestion";
    } & AnsweredQuestionFieldsFragment;
  };

export type CommentLikeNewsFieldsFragment = {
  __typename?: "CommentLikeNews";
} & Pick<CommentLikeNews, "editionId" | "commentId"> & {
    performer: { __typename?: "User" } & UserFieldsFragment;
    answerOwner: { __typename?: "User" } & UserFieldsFragment;
    question: {
      __typename?: "AnsweredQuestion";
    } & AnsweredQuestionFieldsFragment;
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
          | ({
              __typename?: "NewAnswerEditionNews";
            } & NewAnswerEditionNewsFieldsFragment)
          | ({ __typename?: "NewCommentNews" } & NewCommentNewsFieldsFragment)
          | ({ __typename?: "EditionLikeNews" } & EditionLikeNewsFieldsFragment)
          | ({ __typename?: "CommentLikeNews" } & CommentLikeNewsFieldsFragment)
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
  answeredQuestion: Maybe<
    { __typename?: "AnsweredQuestion" } & AnsweredQuestionFieldsFragment
  >;
};

export type UnansweredQuestionsQueryVariables = {
  userId: Scalars["ID"];
  tags?: Maybe<Array<Scalars["String"]>>;
  first: Scalars["Int"];
  after?: Maybe<Scalars["String"]>;
};

export type UnansweredQuestionsQuery = { __typename?: "Query" } & {
  unansweredQuestions: Maybe<
    {
      __typename?: "UnansweredQuestionConnection";
    } & UnansweredQuestionConnectionFieldsFragment
  >;
};

export type AnsweredQuestionsQueryVariables = {
  userId: Scalars["ID"];
  tags?: Maybe<Array<Scalars["String"]>>;
  first: Scalars["Int"];
  after?: Maybe<Scalars["String"]>;
};

export type AnsweredQuestionsQuery = { __typename?: "Query" } & {
  answeredQuestions: Maybe<
    {
      __typename?: "AnsweredQuestionConnection";
    } & AnsweredQuestionConnectionFieldsFragment
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

export type LikeCommentMutationVariables = {
  answerId: Scalars["ID"];
  answerEditionId: Scalars["ID"];
  commentId: Scalars["ID"];
  userLikes: Scalars["Int"];
};

export type LikeCommentMutation = { __typename?: "Mutation" } & {
  likeComment: { __typename?: "Comment" } & CommentFieldsFragment;
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
  mentionedUsers?: Maybe<Array<Scalars["ID"]>>;
};

export type AddAnswerMutation = { __typename?: "Mutation" } & {
  addAnswer: { __typename?: "Answer" } & AnswerFieldsFragment;
};

export type EditAnswerMutationVariables = {
  answerId: Scalars["ID"];
  answerValue: Scalars["String"];
  mentionedUsers?: Maybe<Array<Scalars["ID"]>>;
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
  questionNotApply: {
    __typename?: "UnansweredQuestion";
  } & UnansweredQuestionFieldsFragment;
};

export type LoginMutationVariables = {
  email: Scalars["String"];
  name: Scalars["String"];
};

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "LoginResult" } & Pick<LoginResult, "authToken"> & {
      user: { __typename?: "User" } & UserFieldsFragment;
    };
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
  | "id"
  | "fullName"
  | "avatarSrc"
  | "intro"
  | "me"
  | "followers"
  | "following"
  | "experience"
> & {
    socialMediaLinks: Maybe<
      { __typename?: "SocialMediaLinks" } & Pick<
        SocialMediaLinks,
        "facebookLink" | "twitterLink" | "instagramLink" | "linkedInLink"
      >
    >;
  };

export type LikerFieldsFragment = { __typename?: "Liker" } & Pick<
  Liker,
  "numOfLikes"
> & { user: { __typename?: "User" } & UserFieldsFragment };

export type LikesFieldsFragment = { __typename?: "Likes" } & Pick<
  Likes,
  "total"
> & { likers: Array<{ __typename?: "Liker" } & LikerFieldsFragment> };

export type CommentFieldsFragment = { __typename?: "Comment" } & Pick<
  Comment,
  "id" | "value"
> & {
    user: { __typename?: "User" } & UserFieldsFragment;
    likes: Maybe<{ __typename?: "Likes" } & LikesFieldsFragment>;
  };

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

export type AnsweredQuestionFieldsFragment = {
  __typename?: "AnsweredQuestion";
} & Pick<AnsweredQuestion, "id" | "value" | "tags"> & {
    answer: { __typename?: "Answer" } & AnswerFieldsFragment;
  };

export type UnansweredQuestionFieldsFragment = {
  __typename?: "UnansweredQuestion";
} & Pick<UnansweredQuestion, "id" | "value" | "tags">;

export type PageInfoFieldsFragment = { __typename?: "PageInfo" } & Pick<
  PageInfo,
  "startCursor" | "endCursor" | "hasNextPage" | "hasPreviousPage"
>;

export type AnsweredQuestionEdgeFieldsFragment = Pick<Edge, "cursor"> & {
  node: AnsweredQuestionFieldsFragment;
};

export type UnansweredQuestionEdgeFieldsFragment = Pick<Edge, "cursor"> & {
  node: UnansweredQuestionFieldsFragment;
};

export type AnsweredQuestionConnectionFieldsFragment = {
  __typename?: "AnsweredQuestionConnection";
} & Pick<AnsweredQuestionConnection, "totalCount"> & {
    pageInfo: { __typename?: "PageInfo" } & PageInfoFieldsFragment;
    edges: Maybe<
      Array<
        {
          __typename?: "AnsweredQuestionEdge";
        } & AnsweredQuestionEdgeFieldsFragment
      >
    >;
  };

export type UnansweredQuestionConnectionFieldsFragment = {
  __typename?: "UnansweredQuestionConnection";
} & Pick<UnansweredQuestionConnection, "totalCount"> & {
    pageInfo: { __typename?: "PageInfo" } & PageInfoFieldsFragment;
    edges: Maybe<
      Array<
        {
          __typename?: "UnansweredQuestionEdge";
        } & UnansweredQuestionEdgeFieldsFragment
      >
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
  (
    | ({ __typename?: "AnswerEditionLike" } & Pick<
        AnswerEditionLike,
        "userProfileId" | "questionId" | "editionId"
      >)
    | ({ __typename?: "CommentLike" } & Pick<
        CommentLike,
        "userProfileId" | "questionId" | "editionId" | "commentId"
      >)
    | ({ __typename?: "NewComment" } & Pick<
        NewComment,
        "userProfileId" | "questionId" | "editionId" | "commentId"
      >)
    | ({ __typename?: "AnswerEditionMention" } & Pick<
        AnswerEditionMention,
        "userProfileId" | "questionId" | "editionId"
      >));
