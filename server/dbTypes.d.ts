import { Document, Model, Types as GooseTypes } from "mongoose";

export interface Notification {
  _id: GooseTypes.ObjectId;
  type: string;
  questionId?: string;
  commentId?: string;
  performerId: string;
  performerAvatarSrc: string;
  text: string;
  seen: boolean;
}

export interface User extends Document {
  firstName: string;
  surName: string;
  email: string;
  password: string;
  avatarSrc: string;
  followers: GooseTypes.ObjectId[];
  following: GooseTypes.ObjectId[];
  notifications: Notification[];
}

export interface Comment extends Document {
  value: string;
  userId: string;
}

export interface Liker extends Document {
  user: User; //this has to change only to userId
  numOfLikes: number;
}

export interface Edition extends Document {
  date: Date;
  before: string;
  after: string;
}

export interface Answer extends Document {
  userId: string;
  questionId: string;
  value: string;
  position: number;
  comments: Comment[];
  likes: {
    totalLikes: number;
    likers: Liker[];
  };
  editions: Edition[];
}
