const { ObjectId } = require('mongoose').Types;

function mapGqlUser(context, user) {
  let me = false;

  if (context.user) {
    me = context.user.id === user._id.toString();
  }

  const res = {
    id: user._id.toString(),
    email: user.email,
    fullName: `${user.firstName} ${user.surName}`,
    intro: user.intro,
    avatarSrc: user.avatarSrc || '',
    me,
    followers: user.followers || [],
    following: user.following || [],
  };

  return res;
}

const mapGqlUsers = (context, users) => {
  return users.map(u => mapGqlUser(context, u));
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

function mapGqlComment(context, commentAuthor, comment) {
  const usr = mapGqlUser(context, commentAuthor);
  return {
    id: comment._id.toString(),
    user: usr,
    comment: comment.comment,
  };
}

const mapGqlQuestions = questions => {
  return questions.map(q => {
    const shapedQuestion = {
      id: q._id.toString(),
      question: q.question,
      type: q.type,
      possibleAnswers: q.possibleAnswers,
    };

    if (q.answer) {
      shapedQuestion.answer = {
        id: q.answer._id.toString(),
        value: q.answer.value,
      };
    }

    return shapedQuestion;
  });
};

const mapGqlAnswer = answer => ({
  id: answer._id.toString(),
  questionId: answer.questionId.toString(),
  userId: answer.userId.toString(),
  value: answer.value,
});

module.exports = {
  mapGqlComment,
  mapGqlAnswer,
  mapGqlUser,
  mapGqlUsers,
  mapGqlNotification,
  mapGqlNotifications,
  mapGqlQuestions,
};
