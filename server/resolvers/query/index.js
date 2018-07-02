const db = require('../../database');

function books() {
  return db.books;
}

function book() {
  console.dir(db.books[0]);
  return db.books[0];
}

function isAnswered(question, usr) {
  return usr.questions.some(q => q.id === question.id);
}

function questions(root, { userId, all }, context, info) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const usr = db.users.find(u => u.id === userId);

  const answeredQs = usr.questions.map(q => {
    const dbQuestion = db.questions.find(dbQ => dbQ.id === q.id);
    const dbAnswer = db.answers.find(dbA => dbA.id === q.answer.id);

    return {
      id: q.id,
      type: dbQuestion.type,
      possibleValues: dbQuestion.possibleValues,
      value: dbQuestion.value,
      answer: { id: dbAnswer.id, value: dbAnswer.value },
    };
  });

  const result = { answered: answeredQs };

  if (all) {
    result.unanswered = db.questions.filter(q => !isAnswered(q, usr));
  }

  return result;
}

function shapedUser(context, dbUser) {
  return {
    id: dbUser.id,
    email: dbUser.email,
    fullName: `${dbUser.firstName} ${dbUser.surName}`,
    avatarSrc: dbUser.avatarSrc,
    me: context.user.id === dbUser.id,
  };
}

function users(_, args, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const matchedDbUsers = db.users.filter(usr => {
    const name = `${usr.firstName.toLowerCase()} ${usr.surName.toLowerCase()}`;
    const match = args.match.toLowerCase();
    return name.includes(match);
  });

  const result = matchedDbUsers.map(dbUsr => shapedUser(context, dbUsr));

  return result;
}

function user(_, { id }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const dbUser = db.users.find(usr => usr.id === id);

  if (!dbUser) return null;
  return shapedUser(context, dbUser);
}

module.exports = {
  books,
  book,
  users,
  user,
  questions,
};
