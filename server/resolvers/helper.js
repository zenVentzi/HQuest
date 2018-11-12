const { ObjectId } = require('mongoose').Types;

function mapGqlUser({ user, loggedUserId }) {
  let me = false;

  if (loggedUserId) {
    me = loggedUserId === user._id.toString();
  }

  const res = {
    id: user._id.toString(),
    email: user.email,
    fullName: `${user.firstName} ${user.surName}`,
    intro: user.intro,
    socialMediaLinks: user.socialMediaLinks,
    avatarSrc: user.avatarSrc || '',
    me,
    followers: user.followers || [],
    following: user.following || [],
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

function mapGqlComment({ commentAuthor, comment, loggedUserId }) {
  const usr = mapGqlUser({ user: commentAuthor, loggedUserId });
  return {
    id: comment._id.toString(),
    user: usr,
    comment: comment.comment,
  };
}

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
    likes: mapGqlLikes({ likes: answer.likes, loggedUserId }),
    editions: answer.editions,
    value: answer.value,
    position: answer.position,
  };
  return res;
};

const mapGqlQuestion = ({ question, loggedUserId }) => {
  const shapedQuestion = {
    id: question._id.toString(),
    question: question.question,
    type: question.type,
    defaultAnswer: question.defaultAnswer,
    possibleAnswers: question.possibleAnswers,
    tags: question.tags,
  };

  if (question.answer) {
    shapedQuestion.answer = mapGqlAnswer({
      answer: question.answer,
      loggedUserId,
    });
  }

  return shapedQuestion;
};

const mapGqlQuestions = ({ questions, loggedUserId }) => {
  return questions.map(question => {
    return mapGqlQuestion({ question, loggedUserId });
  });
};

module.exports = {
  mapGqlComment,
  mapGqlAnswer,
  mapGqlUser,
  mapGqlUsers,
  mapGqlNotification,
  mapGqlNotifications,
  mapGqlQuestions,
  mapGqlQuestion,
};
