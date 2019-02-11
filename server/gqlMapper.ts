import * as dbTypes from "./dbTypes";
import * as gqlTypes from "./generated/gqltypes";

function getLikes({
  dbLikes,
  loggedUserId
}: {
  dbLikes?: dbTypes.Likes | null;
  loggedUserId: string;
}): gqlTypes.Likes | null {
  if (!dbLikes) return null;

  const gqlLikes: gqlTypes.Likes = { total: dbLikes.total, likers: [] };

  dbLikes.likers.forEach(dbLiker => {
    const gqlLiker = {
      user: getUser({ dbUser: dbLiker.user, loggedUserId }),
      numOfLikes: dbLiker.numOfLikes
    };
    gqlLikes.likers!.push(gqlLiker);
  });

  return gqlLikes;
}

function getUser({
  dbUser,
  loggedUserId
}: {
  dbUser: dbTypes.User;
  loggedUserId: string;
}): gqlTypes.User {
  let me = false;

  if (loggedUserId) {
    me = loggedUserId === dbUser._id.toString();
  }

  let followers;
  let following;

  if (dbUser.followers && dbUser.followers.length) {
    followers = dbUser.followers.map(followerId => followerId.toString());
  }
  if (dbUser.following && dbUser.following.length) {
    following = dbUser.following.map(followingUserId =>
      followingUserId.toString()
    );
  }

  const gqlUser = {
    id: dbUser._id.toString(),
    email: dbUser.email,
    fullName: `${dbUser.firstName} ${dbUser.surName}`,
    intro: dbUser.intro,
    socialMediaLinks: dbUser.socialMediaLinks,
    avatarSrc: dbUser.avatarSrc || "",
    me,
    followers,
    following
  };

  return gqlUser;
}

function getUsers({
  dbUsers,
  loggedUserId
}: {
  dbUsers: null;
  loggedUserId: string;
}): null;
function getUsers({
  dbUsers,
  loggedUserId
}: {
  dbUsers: dbTypes.User[];
  loggedUserId: string;
}): gqlTypes.User[];
function getUsers({
  dbUsers,
  loggedUserId
}: {
  dbUsers: dbTypes.User[] | null;
  loggedUserId: string;
}): gqlTypes.User[] | null;
function getUsers({
  dbUsers,
  loggedUserId
}: {
  dbUsers: dbTypes.User[] | null;
  loggedUserId: string;
}): gqlTypes.User[] | null {
  if (!dbUsers || !dbUsers.length) return null;
  return dbUsers.map(dbUser => getUser({ dbUser, loggedUserId }));
}

// const us = getUsers({ dbUsers: null! as dbTypes.User[], loggedUserId: "" });
// let users: dbTypes.User[] | null = 1 > 5 ? null : [];
// const us1 = getUsers({ dbUsers: users, loggedUserId: "" });

function getQuestion({
  dbQuestion,
  dbAnswer,
  loggedUserId
}: {
  dbQuestion: dbTypes.Question;
  dbAnswer?: dbTypes.Answer;
  loggedUserId: string;
}): gqlTypes.Question {
  const gqlQuestion: gqlTypes.Question = {
    id: dbQuestion._id.toString(),
    value: dbQuestion.value,
    tags: dbQuestion.tags
  };

  if (dbAnswer) {
    if (!dbAnswer.questionId.equals(dbQuestion._id)) {
      throw Error("Cannot map answer to question with wrong id");
    }

    gqlQuestion.answer = getAnswer({
      dbAnswer,
      loggedUserId
    });
  }

  return gqlQuestion;
}

function getQuestions({
  dbQuestions,
  loggedUserId
}: {
  dbQuestions: any;
  loggedUserId: string;
}): gqlTypes.Question[] {
  return dbQuestions.map(dbQuestion => {
    return getQuestion({
      dbQuestion,
      dbAnswer: dbQuestion.answer,
      loggedUserId
    });
  });
}

function getNewsfeed({
  newsFeed,
  newsFeedUsers,
  newsFeedQuestions,
  loggedUserId
}: {
  newsFeed: any;
  newsFeedUsers: any;
  newsFeedQuestions: any;
  loggedUserId: string;
}): any {
  const gqlUsers = getUsers({ dbUsers: newsFeedUsers, loggedUserId });
  const gqlQuestions = getQuestions({
    dbQuestions: newsFeedQuestions,
    loggedUserId
  });

  // type Fn = <T, R>(arg: T) => R;

  const res = newsFeed.map(news => {
    const gqlNews = { ...news };
    gqlNews.createdOn = news._id.getTimestamp();
    // @ts-ignore
    gqlNews.performer = gqlUsers.find(usr => news.performerId === usr.id);

    if (news.followedUserId) {
      // @ts-ignore
      gqlNews.followedUser = gqlUsers.find(
        usr => news.followedUserId === usr.id
      );
      delete gqlNews.followedUserId;
    } else if (news.answerId) {
      const newsQuestion = gqlQuestions.find(
        q => news.answerId === q.answer!.id
      );

      if (newsQuestion) {
        gqlNews.question = newsQuestion;
        // @ts-ignore
        gqlNews.answerOwner = gqlUsers.find(
          usr => news.answerOwnerId === usr.id
        );
        delete gqlNews.answerOwnerId;
        delete gqlNews.questionId;
      }
      delete gqlNews.answerId;
    }

    delete gqlNews._id;
    delete gqlNews.performerId;
    return gqlNews;
  });

  return res;
}

function getNotification(notif: dbTypes.Notification): gqlTypes.Notification {
  const res: gqlTypes.Notification = {
    id: notif._id.toString(),
    type: notif.type,
    performerId: notif.performerId,
    performerAvatarSrc: notif.performerAvatarSrc,
    text: notif.text,
    seen: notif.seen,
    createdOn: notif._id.getTimestamp()
  };

  switch (notif.type) {
    case dbTypes.NotificationType.NewComment:
      (res as gqlTypes.NewComment).questionId = (notif as dbTypes.NewComment).questionId;
      (res as gqlTypes.NewComment).commentId = (notif as dbTypes.NewComment).commentId;
      break;

    default:
      break;
  }

  return res;
}

function getNotifications(
  notifs: dbTypes.Notification[] | null
): gqlTypes.Notification[] | null {
  if (!notifs || !notifs.length) return null;
  return notifs.map(getNotification);
  // const arr: Array<gqlTypes.NewComment | gqlTypes.NewFollower> = [];
  // return arr;
}

function getComment({
  dbComment,
  loggedUserId
}: {
  dbComment: dbTypes.Comment;
  loggedUserId: string;
}): gqlTypes.Comment {
  const gqlUser = getUser({
    dbUser: dbComment.user as dbTypes.UserDoc,
    loggedUserId
  });

  const gqlComment = {
    id: dbComment._id.toString(),
    user: gqlUser,
    value: dbComment.value
  };

  return gqlComment;
}

function getComments({
  dbComments,
  loggedUserId
}: {
  dbComments?: dbTypes.Comment[];
  loggedUserId: string;
}): gqlTypes.Comment[] | null {
  if (!dbComments || !dbComments.length) return null;

  const gqlComments = dbComments.map(com =>
    getComment({
      dbComment: com,
      loggedUserId
    })
  );

  return gqlComments;
}

function getAnswerEditions({
  dbEditions
}: {
  dbEditions?: dbTypes.Edition[];
}): gqlTypes.AnswerEdition[] | null {
  if (!dbEditions || !dbEditions.length) return null;

  return dbEditions.map(dbE => {
    const gqlEdition: gqlTypes.AnswerEdition = {
      id: dbE._id.toString(),
      after: dbE.after,
      before: dbE.before,
      date: dbE.date
    };

    return gqlEdition;
  });
}

function getAnswer({
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
    comments: getComments({ dbComments: dbAnswer.comments, loggedUserId }),
    likes: getLikes({ dbLikes: dbAnswer.likes, loggedUserId }),
    editions: getAnswerEditions({ dbEditions: dbAnswer.editions }),
    value: dbAnswer.value,
    position: dbAnswer.position
  };

  return gqlAnswer;
}

const gqlMapper = {
  getLikes,
  getAnswerEditions,
  getUser,
  getUsers,
  getQuestion,
  getQuestions,
  getNewsfeed,
  getNotification,
  getNotifications,
  getComment,
  getComments,
  getAnswer
};

export { gqlMapper };
