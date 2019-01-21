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
import { Types } from "../models/user";

export type RegisterUser = (
  User: Types.UserModel
) => (args: LoginMutationArgs) => Promise<Types.User>;

export type LoginUser = RegisterUser;

export type FollowUserBase = (
  User: Types.UserModel
) => (args: FollowMutationArgs, follow: boolean, loggedUserId: string) => void;

export type FollowUser = (
  User: Types.UserModel
) => (args: FollowMutationArgs, loggedUserId: string) => void;

export type UnfollowUser = FollowUser;

export type GetFollowers = (
  User: Types.UserModel
) => (args: FollowingQueryArgs) => Promise<Types.User>;

export type GetFollowing = (
  User: Types.UserModel
) => (args: FollowingQueryArgs) => Promise<Types.User>;

export type EditUser = (
  User: Types.UserModel
) => (args: EditUserMutationArgs, loggedUserId: string) => Promise<Types.User>;

export type GetUsersWithIds = (
  User: Types.UserModel
) => ({ ids }: { ids: GooseTypes.ObjectId }) => Promise<Types.User[]>;

export type GetUser = (
  User: Types.UserModel
) => (args: UserQueryArgs) => Promise<Types.User>;

export type GetUsers = (
  User: Types.UserModel
) => (args: UsersQueryArgs) => Promise<Types.User[]>;

export type UploadAvatar = (
  User: Types.UserModel
) => (args: UploadAvatarMutationArgs, loggedUserId: string) => Promise<string>;
