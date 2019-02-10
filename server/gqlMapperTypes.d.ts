import * as dbTypes from "./dbTypes";
import * as gqlTypes from "./generated/gqltypes";

export type GetLikes = (args: {
  dbLikes?: dbTypes.Likes;
  loggedUserId: string;
}) => gqlTypes.Likes | undefined;

export type GetUser = (args: {
  dbUser: dbTypes.User;
  loggedUserId: string;
}) => gqlTypes.User;

export function getUserss({
  dbUsers,
  loggedUserId
}: {
  dbUsers: any;
  loggedUserId: string;
}): any;

export type GetUsers = <T extends dbTypes.User[] | null>(args: {
  dbUsers: T;
  loggedUserId: string;
}) => T extends dbTypes.User[] ? gqlTypes.User[] : null;

type GetUsers1 = <T extends dbTypes.User[] | null>(
  dbUsers: T
) => T extends dbTypes.User[] ? gqlTypes.User[] : null;

// export type GetUsers = (args: {
//   dbUsers: dbTypes.User[] | null;
//   loggedUserId: string;
// }) => gqlTypes.User[] | null;

export type GetQuestion = (args: {
  dbQuestion: dbTypes.Question;
  dbAnswer?: dbTypes.Answer;
  loggedUserId: string;
}) => gqlTypes.Question;

export type GetQuestions = (args: {
  dbQuestions: any; // implement custom type
  // dbQuestions: dbTypes.Question[];
  loggedUserId: string;
}) => gqlTypes.Question[];

export type GetNewsfeed = (args: {
  newsFeed: any;
  newsFeedUsers: any;
  newsFeedQuestions: any;
  loggedUserId: string;
}) => any;

export type GetNotification = (
  notif: dbTypes.Notification
) => gqlTypes.Notification;

export type GetNotifications = (
  notifs: dbTypes.Notification[] | null
) => gqlTypes.Notification[] | null;

export type GetComment = (args: {
  dbComment: dbTypes.Comment;
  loggedUserId: string;
}) => gqlTypes.Comment;

/* 

change all undefined to null

*/

export type GetComments = (args: {
  dbComments?: dbTypes.Comment[];
  loggedUserId: string;
}) => gqlTypes.Comment[] | undefined;

export type GetAnswerEditions = (args: {
  dbEditions?: dbTypes.Edition[];
}) => gqlTypes.AnswerEdition[] | undefined;

export type GetAnswer = (args: {
  dbAnswer: dbTypes.Answer;
  loggedUserId: string;
}) => gqlTypes.Answer;
