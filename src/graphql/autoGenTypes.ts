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
// Documents
// ====================================================

export type NewsfeedVariables = {};

export type NewsfeedQuery = {
  __typename?: "Query";

  newsfeed: Maybe<NewsfeedNewsfeed[]>;
};

export type NewsfeedNewsfeed = {
  __typename?:
    | NewsfeedAnswerNewsInlineFragment["__typename"]
    | NewsfeedCommentNewsInlineFragment["__typename"]
    | NewsfeedNewLikeNewsInlineFragment["__typename"]
    | NewsfeedNewFollowerNewsInlineFragment["__typename"];

  type: NewsType;

  createdOn: DateTime;
} & (
  | NewsfeedAnswerNewsInlineFragment
  | NewsfeedCommentNewsInlineFragment
  | NewsfeedNewLikeNewsInlineFragment
  | NewsfeedNewFollowerNewsInlineFragment);

export type NewsfeedAnswerNewsInlineFragment = {
  __typename?: "AnswerNews";

  performer: NewsfeedPerformer;

  question: NewsfeedQuestion;
};

export type NewsfeedPerformer = UserFieldsFragment;

export type NewsfeedQuestion = QuestionFieldsFragment;

export type NewsfeedCommentNewsInlineFragment = {
  __typename?: "CommentNews";

  performer: Newsfeed_Performer;

  answerOwner: NewsfeedAnswerOwner;

  question: Newsfeed_Question;

  commentId: string;
};

export type Newsfeed_Performer = UserFieldsFragment;

export type NewsfeedAnswerOwner = UserFieldsFragment;

export type Newsfeed_Question = QuestionFieldsFragment;

export type NewsfeedNewLikeNewsInlineFragment = {
  __typename?: "NewLikeNews";

  performer: Newsfeed__Performer;

  answerOwner: Newsfeed_AnswerOwner;

  question: Newsfeed__Question;
};

export type Newsfeed__Performer = UserFieldsFragment;

export type Newsfeed_AnswerOwner = UserFieldsFragment;

export type Newsfeed__Question = QuestionFieldsFragment;

export type NewsfeedNewFollowerNewsInlineFragment = {
  __typename?: "NewFollowerNews";

  performer: Newsfeed___Performer;

  followedUser: NewsfeedFollowedUser;
};

export type Newsfeed___Performer = UserFieldsFragment;

export type NewsfeedFollowedUser = UserFieldsFragment;

export type NotificationsVariables = {};

export type NotificationsQuery = {
  __typename?: "Query";

  notifications: Maybe<NotificationsNotifications[]>;
};

export type NotificationsNotifications = NotificationFieldsFragment;

export type AnsweredQuestionVariables = {
  userId: string;
  questionId: string;
};

export type AnsweredQuestionQuery = {
  __typename?: "Query";

  answeredQuestion: AnsweredQuestionAnsweredQuestion;
};

export type AnsweredQuestionAnsweredQuestion = {
  __typename?: "Question";

  answer: Maybe<AnsweredQuestionAnswer>;
} & QuestionFieldsFragment;

export type AnsweredQuestionAnswer = AnswerFieldsFragment;

export type QuestionsVariables = {
  answered: boolean;
  userId: string;
  tags?: Maybe<string[]>;
  first: number;
  after?: Maybe<string>;
};

export type QuestionsQuery = {
  __typename?: "Query";

  questions: Maybe<QuestionsQuestions>;
};

export type QuestionsQuestions = QuestionConnectionFieldsFragment;

export type QuestionsTagsVariables = {};

export type QuestionsTagsQuery = {
  __typename?: "Query";

  questionsTags: string[];
};

export type UserVariables = {
  id: string;
};

export type UserQuery = {
  __typename?: "Query";

  user: Maybe<UserUser>;
};

export type UserUser = UserFieldsFragment;

export type UsersVariables = {
  match?: Maybe<string>;
};

export type UsersQuery = {
  __typename?: "Query";

  users: Maybe<UsersUsers[]>;
};

export type UsersUsers = UserFieldsFragment;

export type FollowersVariables = {
  userId: string;
};

export type FollowersQuery = {
  __typename?: "Query";

  followers: Maybe<FollowersFollowers[]>;
};

export type FollowersFollowers = UserFieldsFragment;

export type FollowingVariables = {
  userId: string;
};

export type FollowingQuery = {
  __typename?: "Query";

  following: Maybe<FollowingFollowing[]>;
};

export type FollowingFollowing = UserFieldsFragment;

export type NotifsMarkSeenVariables = {};

export type NotifsMarkSeenMutation = {
  __typename?: "Mutation";

  notifsMarkSeen: Maybe<boolean>;
};

export type CommentAnswerVariables = {
  answerId: string;
  comment: string;
};

export type CommentAnswerMutation = {
  __typename?: "Mutation";

  commentAnswer: CommentAnswerCommentAnswer;
};

export type CommentAnswerCommentAnswer = CommentFieldsFragment;

export type EditCommentVariables = {
  answerId: string;
  commentId: string;
  commentValue: string;
};

export type EditCommentMutation = {
  __typename?: "Mutation";

  editComment: EditCommentEditComment;
};

export type EditCommentEditComment = CommentFieldsFragment;

export type RemoveCommentVariables = {
  answerId: string;
  commentId: string;
};

export type RemoveCommentMutation = {
  __typename?: "Mutation";

  removeComment: RemoveCommentRemoveComment;
};

export type RemoveCommentRemoveComment = CommentFieldsFragment;

export type MoveAnswerPositionVariables = {
  position: number;
  answerId: string;
};

export type MoveAnswerPositionMutation = {
  __typename?: "Mutation";

  moveAnswerPosition: Maybe<number>;
};

export type AddAnswerVariables = {
  questionId: string;
  answerValue: string;
};

export type AddAnswerMutation = {
  __typename?: "Mutation";

  addAnswer: AddAnswerAddAnswer;
};

export type AddAnswerAddAnswer = AnswerFieldsFragment;

export type EditAnswerVariables = {
  answerId: string;
  answerValue: string;
};

export type EditAnswerMutation = {
  __typename?: "Mutation";

  editAnswer: EditAnswerEditAnswer;
};

export type EditAnswerEditAnswer = {
  __typename?: "Answer";

  id: string;

  userId: string;

  questionId: string;

  value: string;
};

export type RemoveAnswerVariables = {
  answerId: string;
};

export type RemoveAnswerMutation = {
  __typename?: "Mutation";

  removeAnswer: RemoveAnswerRemoveAnswer;
};

export type RemoveAnswerRemoveAnswer = AnswerFieldsFragment;

export type LikeAnswerVariables = {
  answerId: string;
  userLikes: number;
};

export type LikeAnswerMutation = {
  __typename?: "Mutation";

  likeAnswer: LikeAnswerLikeAnswer;
};

export type LikeAnswerLikeAnswer = AnswerFieldsFragment;

export type AddQuestionsVariables = {
  questions?: Maybe<InputQuestion[]>;
};

export type AddQuestionsMutation = {
  __typename?: "Mutation";

  addQuestions: Maybe<boolean>;
};

export type QuestionNotApplyVariables = {
  questionId: string;
};

export type QuestionNotApplyMutation = {
  __typename?: "Mutation";

  questionNotApply: QuestionNotApplyQuestionNotApply;
};

export type QuestionNotApplyQuestionNotApply = QuestionFieldsFragment;

export type LoginVariables = {
  email: string;
  name: string;
};

export type LoginMutation = {
  __typename?: "Mutation";

  login: LoginLogin;
};

export type LoginLogin = {
  __typename?: "LoginResult";

  authToken: string;

  userId: string;
};

export type EditUserVariables = {
  input?: Maybe<EditUserInput>;
};

export type EditUserMutation = {
  __typename?: "Mutation";

  editUser: EditUserEditUser;
};

export type EditUserEditUser = {
  __typename?: "User";

  id: string;
};

export type FollowVariables = {
  userId: string;
  follow: boolean;
};

export type FollowMutation = {
  __typename?: "Mutation";

  follow: Maybe<boolean>;
};

export type UploadAvatarVariables = {
  base64Img: string;
};

export type UploadAvatarMutation = {
  __typename?: "Mutation";

  uploadAvatar: string;
};

export type NewNotificationVariables = {
  userId: string;
};

export type NewNotificationSubscription = {
  __typename?: "Subscription";

  newNotification: NewNotificationNewNotification;
};

export type NewNotificationNewNotification = NotificationFieldsFragment;

export type UserFieldsFragment = {
  __typename?: "User";

  id: string;

  fullName: Maybe<string>;

  avatarSrc: Maybe<string>;

  intro: Maybe<string>;

  socialMediaLinks: Maybe<UserFieldsSocialMediaLinks>;

  me: Maybe<boolean>;

  followers: Maybe<string[]>;

  following: Maybe<string[]>;
};

export type UserFieldsSocialMediaLinks = {
  __typename?: "SocialMediaLinks";

  facebookLink: Maybe<string>;

  twitterLink: Maybe<string>;

  instagramLink: Maybe<string>;

  linkedInLink: Maybe<string>;
};

export type CommentFieldsFragment = {
  __typename?: "Comment";

  id: string;

  user: CommentFieldsUser;

  value: string;
};

export type CommentFieldsUser = UserFieldsFragment;

export type AnswerFieldsFragment = {
  __typename?: "Answer";

  id: string;

  userId: string;

  questionId: string;

  value: string;

  comments: Maybe<AnswerFieldsComments[]>;

  likes: Maybe<AnswerFieldsLikes>;

  editions: Maybe<AnswerFieldsEditions[]>;

  position: number;
};

export type AnswerFieldsComments = CommentFieldsFragment;

export type AnswerFieldsLikes = {
  __typename?: "Likes";

  total: number;

  likers: AnswerFieldsLikers[];
};

export type AnswerFieldsLikers = {
  __typename?: "Liker";

  user: AnswerFieldsUser;

  numOfLikes: number;
};

export type AnswerFieldsUser = UserFieldsFragment;

export type AnswerFieldsEditions = {
  __typename?: "AnswerEdition";

  id: string;

  date: DateTime;

  before: string;

  after: string;
};

export type QuestionFieldsFragment = {
  __typename?: "Question";

  id: string;

  value: string;

  tags: Maybe<string[]>;

  answer: Maybe<QuestionFieldsAnswer>;
};

export type QuestionFieldsAnswer = AnswerFieldsFragment;

export type PageInfoFieldsFragment = {
  __typename?: "PageInfo";

  startCursor: Maybe<string>;

  endCursor: Maybe<string>;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
};

export type QuestionEdgeFieldsFragment = {
  __typename?: "Edge";

  cursor: string;

  node: QuestionEdgeFieldsNode;
};

export type QuestionEdgeFieldsNode = QuestionFieldsFragment;

export type QuestionConnectionFieldsFragment = {
  __typename?: "QuestionConnection";

  pageInfo: QuestionConnectionFieldsPageInfo;

  edges: Maybe<QuestionConnectionFieldsEdges[]>;

  totalCount: number;
};

export type QuestionConnectionFieldsPageInfo = PageInfoFieldsFragment;

export type QuestionConnectionFieldsEdges = QuestionEdgeFieldsFragment;

export type NotificationFieldsFragment = {
  __typename?: "Notification";

  id: string;

  type: NotificationType;

  performerId: string;

  performerAvatarSrc: string;

  text: string;

  seen: boolean;

  createdOn: DateTime;
} & NotificationFieldsNewCommentInlineFragment;

export type NotificationFieldsNewCommentInlineFragment = {
  __typename?: "NewComment";

  commentId: string;

  questionId: string;
};
