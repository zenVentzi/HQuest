import { ContextUser } from "./gqlContext";

declare global {
  namespace Express {
    interface Request {
      user?: ContextUser;
    }
  }
}
