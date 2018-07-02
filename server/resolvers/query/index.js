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

function questions(root, { userId, answered }, context, info) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const usr = db.users.find(u => u.id === userId);

  let qtions;

  if (answered) {
    qtions = usr.questions.map(q => {
      const dbQuestion = db.questions.find(dbQ => dbQ.id === q.id);
      const dbAnswer = db.answers.find(dbA => dbA.id === q.answer.id);

      return {
        id: q.id,
        possibleValues: dbQuestion.possibleValues,
        value: dbQuestion.value,
        type: dbQuestion.type,
        answer: { id: dbAnswer.id, value: dbAnswer.value },
      };
    });
  } else {
    qtions = db.questions.filter(q => !isAnswered(q, usr));
  }

  return qtions;
}

function users(_, args, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const matchedUsers = db.users.filter(usr => {
    const name = `${usr.firstName.toLowerCase()} ${usr.surName.toLowerCase()}`;
    const match = args.match.toLowerCase();
    return name.includes(match);
  });

  return matchedUsers;
}

function user(_, { id }, context) {
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const dbUser = db.users.find(usr => usr.id === id);

  if (!dbUser) return null;

  const result = {
    id: dbUser.id,
    email: dbUser.email,
    fullName: `${dbUser.firstName} ${dbUser.surName}`,
    avatarSrc: dbUser.avatarSrc,
  };

  return result;
}

module.exports = {
  books,
  book,
  users,
  user,
  questions,
};
