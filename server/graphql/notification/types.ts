export interface Notification {
  id: string;

  type: NotificationType;

  performerId: string;

  performerAvatarSrc: string;

  text: string;

  seen: boolean;

  createdOn: Date;
}

export enum NotificationType {
  NewFollower = "NEW_FOLLOWER",
  NewComment = "NEW_COMMENT"
}

export interface NewComment extends Notification {
  id: string;

  type: NotificationType;

  performerId: string;

  performerAvatarSrc: string;

  text: string;

  seen: boolean;

  createdOn: Date;

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

  createdOn: Date;
}
