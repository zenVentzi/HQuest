const getUser = ({ dbUser, loggedUserId }) => {
  let me = false;

  if (loggedUserId) {
    me = loggedUserId === dbUser._id.toString();
  }

  let followers = [];
  let following = [];

  if (dbUser.followers) {
    followers = dbUser.followers.map(followerId => followerId.toString());
  }
  if (dbUser.following) {
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
    avatarSrc: dbUser.avatarSrc || '',
    me,
    followers,
    following,
  };

  return gqlUser;
};

const getUsers = ({ dbUsers, loggedUserId }) => {
  return dbUsers.map(dbUser => getUser({ dbUser, loggedUserId }));
};

const getComment = ({ dbComment, loggedUserId }) => {
  const gqlUser = getUser({ dbUser: dbComment.user, loggedUserId });

  const gqlComment = {
    id: dbComment._id.toString(),
    user: gqlUser,
    value: dbComment.value,
  };

  return gqlComment;
};

const getComments = ({ comments: dbComments, loggedUserId }) => {
  if (!dbComments) return null;

  const gqlComments = dbComments.map(com =>
    getComment({
      dbComment: com,
      loggedUserId,
    })
  );

  return gqlComments;
};

const getLikes = ({ dbLikes, loggedUserId }) => {
  if (!dbLikes) return null;

  const gqlLikes = { total: dbLikes.total, likers: [] };
  dbLikes.likers.forEach(dbLiker => {
    const gqlLiker = {
      user: getUser({ user: dbLiker.user, loggedUserId }),
      numOfLikes: dbLiker.numOfLikes,
    };
    gqlLikes.likers.push(gqlLiker);
  });
  return gqlLikes;
};

const getAnswer = ({ dbAnswer, loggedUserId }) => {
  const gqlAnswer = {
    id: dbAnswer._id.toString(),
    questionId: dbAnswer.questionId.toString(),
    userId: dbAnswer.userId.toString(),
    comments: getComments({ comments: dbAnswer.comments, loggedUserId }),
    likes: getLikes({ dbLikes: dbAnswer.likes, loggedUserId }),
    editions: dbAnswer.editions ? dbAnswer.editions.reverse() : null,
    value: dbAnswer.value,
    position: dbAnswer.position,
  };

  return gqlAnswer;
};

const getQuestion = ({ dbQuestion, dbAnswer, loggedUserId }) => {
  const gqlQuestion = {
    id: dbQuestion._id.toString(),
    value: dbQuestion.value,
    tags: dbQuestion.tags,
  };

  if (dbAnswer) {
    gqlQuestion.answer = getAnswer({
      dbAnswer,
      loggedUserId,
    });
  }

  return gqlQuestion;
};

const getQuestions = ({ dbQuestions, loggedUserId }) => {
  return dbQuestions.map(dbQuestion => {
    return getQuestion({ dbQuestion, loggedUserId });
  });
};

const getNewsfeed = ({
  newsFeed,
  newsFeedUsers,
  newsFeedQuestions,
  loggedUserId,
}) => {
  const gqlUsers = getUsers({ dbUsers: newsFeedUsers, loggedUserId });
  const gqlQuestions = getQuestions({
    dbQuestions: newsFeedQuestions,
    loggedUserId,
  });

  const res = newsFeed.map(news => {
    const gqlNews = { ...news };
    gqlNews.createdOn = news._id.getTimestamp();
    gqlNews.performer = gqlUsers.find(usr => news.performerId === usr.id);

    if (news.followedUserId) {
      gqlNews.followedUser = gqlUsers.find(
        usr => news.followedUserId === usr.id
      );
      delete gqlNews.followedUserId;
    } else if (news.answerId) {
      const newsQuestion = gqlQuestions.find(
        q => news.answerId === q.answer.id
      );

      if (newsQuestion) {
        gqlNews.question = newsQuestion;
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
};

const gqlMapper = { getUser, getUsers, getQuestion, getQuestions, getNewsfeed };

export { gqlMapper };
