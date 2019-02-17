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

type GetNews = (
  news: dbTypes.News,
  newsfeedUsers: gqlTypes.User[],
  newsfeedQuestions: gqlTypes.Question[]
) => gqlTypes.News;

const getNews: GetNews = (news, newsfeedUsers, newsfeedQuestions) => {
  let gqlNews: gqlTypes.News;

  switch (news.type) {
    case dbTypes.NewsType.NewFollower:
      gqlNews = {
        createdOn: news._id.getTimestamp(),
        type: gqlTypes.NewsType.NewFollower,
        performer: newsfeedUsers.find(u => u.id === news.performerId)!,
        followedUser: newsfeedUsers.find(u => u.id === news.followedUserId)!
      };
      break;
    case dbTypes.NewsType.NewLike:
      gqlNews = {
        createdOn: news._id.getTimestamp(),
        type: gqlTypes.NewsType.NewLike,
        performer: newsfeedUsers.find(u => u.id === news.performerId)!,
        answerOwner: newsfeedUsers.find(u => u.id === news.answerOwnerId)!,
        question: newsfeedQuestions.find(q => q.answer!.id === news.answerId)!
      };
      break;
    case dbTypes.NewsType.NewAnswer:
    case dbTypes.NewsType.NewAnswerEdition:
      gqlNews = {
        createdOn: news._id.getTimestamp(),
        type: news.type,
        performer: newsfeedUsers.find(u => u.id === news.performerId)!,
        answerOwner: newsfeedUsers.find(u => u.id === news.answerOwnerId)!,
        question: newsfeedQuestions.find(q => q.answer!.id === news.answerId)!
      };
      break;
    case dbTypes.NewsType.NewComment:
      gqlNews = {
        createdOn: news._id.getTimestamp(),
        type: news.type,
        commentId: news.commentId,
        performer: newsfeedUsers.find(u => u.id === news.performerId)!,
        answerOwner: newsfeedUsers.find(u => u.id === news.answerOwnerId)!,
        question: newsfeedQuestions.find(q => q.answer!.id === news.answerId)!
      };
      break;
  }

  return gqlNews!;
  /* gqlNews is always covered by the switch statements. 
  Using ! because of typescript compiler limitation
  link to issue https://github.com/Microsoft/TypeScript/issues/18362 */
};

type GetNewsfeed = (
  newsFeed: dbTypes.Newsfeed | null,
  newsFeedUsers: dbTypes.User[],
  newsFeedQuestions: dbTypes.AnsweredQuestion[],
  loggedUserId: string
) => gqlTypes.News[] | null;

const getNewsfeed: GetNewsfeed = (
  newsfeed,
  newsfeedUsers,
  newsfeedQuestions,
  loggedUserId
) => {
  if (!newsfeed || !newsfeed.length) return null;

  const newsfeedUsersGql = getUsers({ dbUsers: newsfeedUsers, loggedUserId });
  const newsfeedQuestionsGql = getQuestions({
    dbQuestions: newsfeedQuestions,
    loggedUserId
  });

  const newsfeedGql = newsfeed.map(news =>
    getNews(news, newsfeedUsersGql, newsfeedQuestionsGql)
  );

  return newsfeedGql;
};

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
