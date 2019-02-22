import { Comment } from "./types";
import { Comment as DbComment } from "../../../../dbTypes";
import { mapUser } from "../../../user/gqlMapper";

function mapComment({
  dbComment,
  loggedUserId
}: {
  dbComment: DbComment;
  loggedUserId: string;
}): Comment {
  const gqlUser = mapUser(dbComment.user, loggedUserId);

  const gqlComment = {
    id: dbComment._id.toString(),
    user: gqlUser,
    value: dbComment.value
  };

  return gqlComment;
}

function mapComments({
  dbComments,
  loggedUserId
}: {
  dbComments?: DbComment[];
  loggedUserId: string;
}): Comment[] | null {
  if (!dbComments || !dbComments.length) return null;

  const gqlComments = dbComments.map(com =>
    mapComment({
      dbComment: com,
      loggedUserId
    })
  );

  return gqlComments;
}

export { mapComment, mapComments };
