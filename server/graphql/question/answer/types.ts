import { User } from "../../user/types";
import { Comment } from "./comment/types";

export interface Answer {
  id: string;

  userId: string;

  questionId: string;

  value: string;

  comments?: Comment[] | null;

  likes?: Likes | null;

  editions?: AnswerEdition[] | null;

  position: number;
}

export interface Likes {
  total: number;

  likers?: Liker[] | null;
}

export interface Liker {
  user: User;

  numOfLikes: number;
}

export interface AnswerEdition {
  id: string;

  date: Date;

  before: string;

  after: string;
}
