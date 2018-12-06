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

function mapGqlComment({ comment, loggedUserId }) {
  const usr = mapGqlUser({ user: comment.user, loggedUserId });
  return {
    id: comment._id.toString(),
    user: usr,
    comment: comment.comment,
  };
}

/* if I modify */
const mapGqlComments = ({ comments, loggedUserId }) => {
  if (!comments) return null;

  /* how do we get each and every comment userDbObj ?
  
  we can't fetch here. THe objects must come from above
  
  I must fetch all the commentAuthors from the controller that calls the helper methods OR store the whole user object not just the userId in the commentObj. This is definitely a bad practice but way easier to read 
  
  approach1: 
  
  1) fetch all UserObjects in the controller
  2) pass them as commentAuthors object

  what I don't like about this approach is that there are unrelated parameters in the function. 

  approach2:
  1) fetch all UserObjects in the controller
  2) attach them to the comments objects

  still a lot of magic

  approach3:NOT

  1) pass context to helper methods and allow them to fetch data themselves. Not doing that because helper = mapper. We don't fetch any data from mapper functions.

  approach4:NOT

  Instead of using one general mapQuestions method, use multiple methods such as mapAnswer and so on

  approach5:

  Apply the comment transformation only once in the answer controller. Meaning that for every answers fetch, we also need to fetch all the users for the comments.

  What bothers me is that so far every object that comes inside the mapper is identical as the db object. This makes an exception that will keep code readers guessing a lot when reading about wheter it's the only place or not.

  approach6:

  Pass down an anonymous function for the transformation

  In this case, for every answer we need to open new fetch request to the db. If we have 20 answers to fetch, we need to open 20 fetch requests. Is that really that bad? We'll find out.

  To fix that, I need to get all the user ids that need to be fetched, from all the answers and then map them manually once fetched.
  */

  const res = comments.map(com =>
    mapGqlComment({
      comment: com,
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
    const newsQuestion = gqlQuestions.find(q => news.answerId === q.answer.id);

    if (newsQuestion) {
      gqlNews.question = newsQuestion;
      gqlNews.answerOwner = gqlUsers.find(usr => news.answerOwnerId === usr.id);
      delete gqlNews.answerOwnerId;
      delete gqlNews.questionId;
    }

    delete gqlNews._id;
    delete gqlNews.answerId;
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
