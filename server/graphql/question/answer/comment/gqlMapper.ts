import { Comment as DbComment } from "../../../../dbTypes";
import { Comment } from "../../../autoGenTypes";
import { mapUser } from "../../../user/gqlMapper";
import { mapLikes } from "../gqlMapper";

function mapComment({
  dbComment,
  loggedUserId
}: {
  dbComment: DbComment;
  loggedUserId: string;
}): Comment {
  const gqlUser = mapUser(dbComment.user, loggedUserId);

  const gqlComment: Comment = {
    id: dbComment._id.toString(),
    user: gqlUser,
    value: dbComment.value,
    likes: mapLikes({ dbLikes: dbComment.likes, loggedUserId })
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
