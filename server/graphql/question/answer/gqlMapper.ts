import { Answer, AnswerEdition, Likes } from "./types";
import {
  Answer as DbAnswer,
  Edition as DbEdition,
  Likes as DbLikes
} from "../../../dbTypes";
import { mapUser } from "../../user/gqlMapper";
import { mapComments } from "./comment/gqlMapper";

function mapAnswer({
  dbAnswer,
  loggedUserId
}: {
  dbAnswer: DbAnswer;
  loggedUserId: string;
}): Answer {
  const gqlAnswer: Answer = {
    id: dbAnswer._id.toString(),
    questionId: dbAnswer.questionId.toString(),
    userId: dbAnswer.userId.toString(),
    comments: mapComments({ dbComments: dbAnswer.comments, loggedUserId }),
    likes: mapLikes({ dbLikes: dbAnswer.likes, loggedUserId }),
    editions: mapAnswerEditions({ dbEditions: dbAnswer.editions }),
    value: dbAnswer.value,
    position: dbAnswer.position
  };

  return gqlAnswer;
}

function mapAnswerEditions({
  dbEditions
}: {
  dbEditions?: DbEdition[];
}): AnswerEdition[] | null {
  if (!dbEditions || !dbEditions.length) return null;
  // console.trace();

  return dbEditions.map(dbE => {
    const gqlEdition: AnswerEdition = {
      id: dbE._id.toString(),
      after: dbE.after,
      before: dbE.before,
      date: dbE.date
    };

    // console.log(typeof dbE.date);

    return gqlEdition;
  });
}

function mapLikes({
  dbLikes,
  loggedUserId
}: {
  dbLikes?: DbLikes | null;
  loggedUserId: string;
}): Likes | null {
  if (!dbLikes) return null;

  const gqlLikes: Likes = { total: dbLikes.total, likers: [] };

  dbLikes.likers.forEach(dbLiker => {
    const gqlLiker = {
      user: mapUser(dbLiker.user, loggedUserId),
      numOfLikes: dbLiker.numOfLikes
    };
    gqlLikes.likers!.push(gqlLiker);
  });

  return gqlLikes;
}

export { mapAnswer, mapAnswerEditions, mapLikes };
