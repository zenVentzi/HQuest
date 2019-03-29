// import { Resolver } from "../../global/types";
// import { User } from "../../user/types";
// import { Comment } from "../../autoGenTypes";
// import { ApolloContext } from "gqlContext";

// export interface Answer {
//   id: string;
//   questionId: string;
//   editions: AnswerEdition[];
//   position: number;
//   userId: string;
// }

// export interface Likes {
//   total: number;
//   likers: Liker[];
// }

// export interface Liker {
//   user: User;
//   numOfLikes: number;
// }

// export interface AnswerEdition {
//   id: string;
//   date: Date;
//   value: string;
//   comments?: Comment[] | null;
//   likes?: Likes | null;

//   // before: string;

//   // after: string;
// }

// // export interface Query {}

// interface EditAnswerArgs {
//   answerId: string;
//   answerValue: string;
// }

// interface AddAnswerArgs {
//   questionId: string;
//   answerValue: string;
// }

// interface RemoveAnswerArgs {
//   answerId: string;
// }

// interface LikeAnswerEditionArgs {
//   answerId: string;
//   answerEditionId: string;
//   userLikes: number;
// }

// interface MoveAnswerPositionArgs {
//   answerId: string;
//   position: number;
// }

// export interface Mutation {
//   editAnswer: Resolver<{}, EditAnswerArgs, ApolloContext, Answer>;
//   addAnswer: Resolver<{}, AddAnswerArgs, ApolloContext, Answer>;
//   removeAnswer: Resolver<{}, RemoveAnswerArgs, ApolloContext, Answer>;
//   likeAnswerEdition: Resolver<
//     {},
//     LikeAnswerEditionArgs,
//     ApolloContext,
//     AnswerEdition
//   >;
//   moveAnswerPosition: Resolver<
//     {},
//     MoveAnswerPositionArgs,
//     ApolloContext,
//     number
//   >;
// }
