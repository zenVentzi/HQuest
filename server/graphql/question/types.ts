import { Answer } from "./answer/types";

export interface Question {
  id: string;

  tags?: string[] | null;

  value: string;

  answer?: Answer | null;
}
