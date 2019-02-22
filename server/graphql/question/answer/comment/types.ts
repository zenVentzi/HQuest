import { User } from "../../../user/types";

export interface Comment {
  id: string;

  user: User;

  value: string;
}
