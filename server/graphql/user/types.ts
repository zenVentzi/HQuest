import { Resolver } from "../global/types";
import { ApolloContext } from "gqlContext";

export interface User {
  id: string;

  me?: boolean | null;

  email?: string | null;

  fullName?: string;

  intro?: string | null;

  socialMediaLinks?: SocialMediaLinks | null;

  avatarSrc?: string | null;

  following?: string[] | null;

  followers?: string[] | null;
}

export interface SocialMediaLinks {
  facebookLink?: string | null;

  twitterLink?: string | null;

  instagramLink?: string | null;

  linkedInLink?: string | null;
}

interface UserArgs {
  id: string;
}

interface UsersArgs {
  match?: string | null;
}

interface FollowersArgs {
  userId: string;
}

interface FollowingArgs {
  userId: string;
}

export interface Query {
  user: Resolver<{}, UserArgs, ApolloContext, User | null>;
  users: Resolver<{}, UsersArgs, ApolloContext, User[] | null>;
  followers: Resolver<{}, FollowersArgs, ApolloContext, User[] | null>;
  following: Resolver<{}, FollowingArgs, ApolloContext, User[] | null>;
}

interface LoginArgs {
  email: string;
  name: string;
}

interface LoginResult {
  authToken: string;
  userId: string;
}

interface SocialMediaLinksInput {
  facebookLink?: string | null;
  twitterLink?: string | null;
  instagramLink?: string | null;
  linkedInLink?: string | null;
}

interface EditUserInput {
  fullName: string;
  intro: string;
  socialMediaLinks: SocialMediaLinksInput;
}

interface EditUserArgs {
  input?: EditUserInput | null;
}

interface FollowArgs {
  userId: string;
  follow: boolean;
}

interface UploadAvatarArgs {
  base64Img: string;
}

export interface Mutation {
  login: Resolver<{}, LoginArgs, ApolloContext, LoginResult>;
  editUser: Resolver<{}, EditUserArgs, ApolloContext, User>;
  follow: Resolver<{}, FollowArgs, ApolloContext, boolean | null>;
  uploadAvatar: Resolver<{}, UploadAvatarArgs, ApolloContext, string>;
}
