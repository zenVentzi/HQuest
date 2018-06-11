const db = require('../../database');

function books() {
  return db.books;
}

function book() {
  console.dir(db.books[0]);
  return db.books[0];
}

// questions(root, args, context, info) {
//   if (!context.user) {
//     throw new Error('You are not authorized!');
//   }

//   const user = users.find(user => user.id === args.userId);

//   const matchingQuestions = user.questionIds.map(id =>
//     questions.find(qs => qs.id === id));

//   return matchingQuestions;
// },
// answers(root, args, context, info) {
//   if (!context.user) {
//     throw new Error('You are not authorized!');
//   }

//   const user = users.find(user => user.id === args.userId);

//   const matchingAnswers = user.answerIds.map(id =>
//     answers.find(answ => answ.id === id));

//   return matchingAnswers;
// },

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

function user(_, args, context) {
  console.dir(context.user);
  if (!context.user) {
    throw new Error('You are not authorized!');
  }

  const matchingUser = db.users.find(usr => usr.id === args.id);

  return matchingUser;
}

module.exports = {
  books,
  book,
  users,
  user,
};
