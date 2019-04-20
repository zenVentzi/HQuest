import * as gqlTypes from "../../autoGenTypes";
import * as dbTypes from "../../../dbTypes";
import { mapUser } from "../../user/gqlMapper";
import { mapComments } from "./comment/gqlMapper";

function mapAnswer({
  dbAnswer,
  loggedUserId
}: {
  dbAnswer: dbTypes.Answer;
  loggedUserId: string;
}): gqlTypes.Answer {
  const gqlAnswer: gqlTypes.Answer = {
    id: dbAnswer._id.toString(),
    questionId: dbAnswer.questionId.toString(),
    userId: dbAnswer.userId.toString(),
    editions: mapAnswerEditions({
      dbEditions: dbAnswer.editions,
      loggedUserId
    }),
    position: dbAnswer.position
  };

  return gqlAnswer;
}

function mapAnswerEditions({
  dbEditions,
  loggedUserId
}: {
  dbEditions: dbTypes.Edition[];
  loggedUserId: string;
}): gqlTypes.AnswerEdition[] {
  // if (!dbEditions || !dbEditions.length) return null;
  // console.trace();

  return dbEditions.map(dbE => {
    return mapAnswerEdition(dbE, loggedUserId);
  });
}

function mapAnswerEdition(dbEdtion: dbTypes.Edition, loggedUserId: string) {
  const gqlEdition: gqlTypes.AnswerEdition = {
    id: dbEdtion._id.toString(),
    date: dbEdtion.date,
    value: dbEdtion.value,
    comments: mapComments({ dbComments: dbEdtion.comments, loggedUserId }),
    likes: mapLikes({ dbLikes: dbEdtion.likes, loggedUserId })
  };

  // console.log(typeof dbE.date);

  return gqlEdition;
}

function mapLikes({
  dbLikes,
  loggedUserId
}: {
  dbLikes?: dbTypes.CommentLikes | dbTypes.EditionLikes | null;
  loggedUserId: string;
}): gqlTypes.Likes | null {
  if (!dbLikes) return null;

  const gqlLikes: gqlTypes.Likes = { total: dbLikes.total, likers: [] };
  // dbLikes.likers.forEach(l => {})

  dbLikes.likers.forEach(dbLiker => {
    const gqlLiker: gqlTypes.Liker = {
      user: mapUser(dbLiker.user, loggedUserId),
      numOfLikes: dbLiker.numOfLikes
    };
    gqlLikes.likers!.push(gqlLiker);
  });

  return gqlLikes;
}

export { mapAnswer, mapAnswerEdition, mapAnswerEditions, mapLikes };
