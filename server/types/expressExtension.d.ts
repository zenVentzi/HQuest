import { User } from "./gqlContext";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
