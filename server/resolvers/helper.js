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
    socialMediaLinks: user.socialMediaLinks,
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

const mapGqlQuestion = question => {
  const shapedQuestion = {
    id: question._id.toString(),
    question: question.question,
    type: question.type,
    possibleAnswers: question.possibleAnswers,
  };

  if (question.answer) {
    shapedQuestion.answer = {
      id: question.answer._id.toString(),
      value: question.answer.value,
    };
  }

  return shapedQuestion;
};

const mapGqlQuestions = questions => {
  return questions.map(q => {
    return mapGqlQuestion(q);
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
  mapGqlQuestion,
};
