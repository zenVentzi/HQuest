const { ObjectId } = require('mongoose').Types;

function mapGqlUser({ user, loggedUserId }) {
  let me = false;

  if (loggedUserId) {
    me = loggedUserId === user._id.toString();
  }

  let followers = [];
  let following = [];

  if (user.followers) {
    followers = user.followers.map(followerId => followerId.toString());
  }
  if (user.following) {
    following = user.following.map(followingUserId =>
      followingUserId.toString()
    );
  }

  const res = {
    id: user._id.toString(),
    email: user.email,
    fullName: `${user.firstName} ${user.surName}`,
    intro: user.intro,
    socialMediaLinks: user.socialMediaLinks,
    avatarSrc: user.avatarSrc || '',
    me,
    followers,
    following,
  };

  return res;
}

const mapGqlUsers = ({ users, loggedUserId }) => {
  return users.map(user => mapGqlUser({ user, loggedUserId }));
};

const mapGqlNotification = notif => {
  const res = {
    id: notif._id.toString(),
    type: notif.type,
    performerId: notif.performerId,
    performerAvatarSrc: notif.performerAvatarSrc,
    text: notif.text,
    seen: notif.seen,
    createdOn: notif._id.getTimestamp(),
  };

  switch (notif.type) {
    case 'NEW_COMMENT':
      res.questionId = notif.questionId;
      res.commentId = notif.commentId;
      break;

    default:
      break;
  }

  return res;
};

const mapGqlNotifications = notifs => {
  return notifs.map(mapGqlNotification);
};

function mapGqlComment({ dbComment, loggedUserId }) {
  const usr = mapGqlUser({ user: dbComment.user, loggedUserId });
  return {
    id: dbComment._id.toString(),
    user: usr,
    comment: dbComment.comment,
  };
}

const mapGqlComments = ({ comments, loggedUserId }) => {
  if (!comments) return null;

  const res = comments.map(com =>
    mapGqlComment({
      dbComment: com,
      loggedUserId,
    })
  );

  return res;
};

const mapGqlLikes = ({ likes, loggedUserId }) => {
  if (!likes) return null;

  const res = { total: likes.total, likers: [] };
  likes.likers.forEach(dbLiker => {
    const gqlLiker = {
      user: mapGqlUser({ user: dbLiker.user, loggedUserId }),
      numOfLikes: dbLiker.numOfLikes,
    };
    res.likers.push(gqlLiker);
  });
  return res;
};

const mapGqlAnswer = ({ answer, loggedUserId }) => {
  const res = {
    id: answer._id.toString(),
    questionId: answer.questionId.toString(),
    userId: answer.userId.toString(),
    numOfComments: answer.comments.length,
    comments: mapGqlComments({ comments: answer.comments, loggedUserId }),
    likes: mapGqlLikes({ likes: answer.likes, loggedUserId }),
    editions: answer.editions ? answer.editions.reverse() : null,
    value: answer.value,
    position: answer.position,
  };
  return res;
};

const mapGqlQuestion = ({ question, loggedUserId }) => {
  const gqlQuestion = {
    id: question._id.toString(),
    value: question.value,
    tags: question.tags,
  };

  if (question.answer) {
    gqlQuestion.answer = mapGqlAnswer({
      answer: question.answer,
      loggedUserId,
    });
  }

  return gqlQuestion;
};

const mapGqlQuestions = ({ questions, loggedUserId }) => {
  return questions.map(question => {
    return mapGqlQuestion({ question, loggedUserId });
  });
};

const mapGqlNewsFeed = ({
  newsFeed,
  newsFeedUsers,
  newsFeedQuestions,
  loggedUserId,
}) => {
  const gqlUsers = mapGqlUsers({ users: newsFeedUsers, loggedUserId });
  const gqlQuestions = mapGqlQuestions({
    questions: newsFeedQuestions,
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

module.exports = {
  mapGqlComment,
  mapGqlAnswer,
  mapGqlUser,
  mapGqlUsers,
  mapGqlNotification,
  mapGqlNotifications,
  mapGqlQuestion,
  mapGqlQuestions,
  mapGqlNewsFeed,
};
