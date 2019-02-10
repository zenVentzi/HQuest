// import { Types as GooseTypes } from "mongoose";
import {
  Notification,
  Maybe,
  UploadAvatarMutationArgs
} from "../generated/gqltypes";
import * as DbTypes from "../dbTypes";
import { UserModel } from "../models/user";
import { AnswerModel } from "../models/answer";

export type Notify = (
  User: UserModel
) => ({
  receiverId,
  notif,
  loggedUserId
}: {
  receiverId: string;
  notif: DbTypes.Notification;
  loggedUserId: string;
}) => void;
export type NewComment = (
  User: UserModel,
  Answer: AnswerModel
) => ({
  answerId,
  dbComment,
  loggedUserId
}: {
  answerId: string;
  dbComment: DbTypes.CommentDoc;
  loggedUserId: string;
}) => void;

export type NewFollower = (
  User: UserModel
) => ({
  receiverId,
  loggedUserId
}: {
  receiverId: string;
  loggedUserId: string;
}) => void;

export type MarkSeen = (
  User: UserModel
) => ({ loggedUserId }: { loggedUserId: string }) => void;

export type GetNotifications = (
  User: UserModel
) => ({
  loggedUserId
}: {
  loggedUserId: string;
}) => Promise<DbTypes.Notification[] | null>;
