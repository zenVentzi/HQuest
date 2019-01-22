import { Types as GooseTypes } from "mongoose";
import {
  UserQueryArgs,
  UsersQueryArgs,
  LoginMutationArgs,
  FollowMutationArgs,
  FollowersQueryArgs,
  FollowingQueryArgs,
  EditUserMutationArgs,
  Maybe,
  UploadAvatarMutationArgs
} from "../generated/gqltypes";
import * as DbTypes from "../dbTypes";
import { UserModel } from "../models/user";

export type RegisterUser = (
  User: UserModel
) => (args: LoginMutationArgs) => Promise<DbTypes.User>;

export type LoginUser = RegisterUser;

export type FollowUserBase = (
  User: UserModel
) => (args: FollowMutationArgs, follow: boolean, loggedUserId: string) => void;

export type FollowUser = (
  User: UserModel
) => (args: FollowMutationArgs, loggedUserId: string) => void;

export type UnfollowUser = FollowUser;

export type GetFollowers = (
  User: UserModel
) => (args: FollowingQueryArgs) => Promise<DbTypes.User>;

export type GetFollowing = (
  User: UserModel
) => (args: FollowingQueryArgs) => Promise<DbTypes.User>;

export type EditUser = (
  User: UserModel
) => (
  args: EditUserMutationArgs,
  loggedUserId: string
) => Promise<DbTypes.User>;

export type GetUsersWithIds = (
  User: UserModel
) => ({ ids }: { ids: GooseTypes.ObjectId[] }) => Promise<DbTypes.User[]>;

export type GetUser = (
  User: UserModel
) => (args: UserQueryArgs) => Promise<DbTypes.User>;

export type GetUsers = (
  User: UserModel
) => (args: UsersQueryArgs) => Promise<DbTypes.User[]>;

export type UploadAvatar = (
  User: UserModel
) => (args: UploadAvatarMutationArgs, loggedUserId: string) => Promise<string>;
